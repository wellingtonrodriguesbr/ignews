import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { query } from "faunadb";
import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: "https://github.com/login/oauth/authorize?scope=read:user",
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        const userActiveSubscription = await fauna.query(
          query.Get(
            query.Intersection([
              query.Match(
                query.Index("subscription_by_user_ref"),
                query.Select(
                  "ref",
                  query.Get(
                    query.Match(
                      query.Index("user_by_email"),
                      query.Casefold(session.user.email)
                    )
                  )
                )
              ),
              query.Match(query.Index("subscription_by_status"), "active"),
            ])
          )
        );
        Object.assign(session, {
          activeSubscription: userActiveSubscription,
        });
      } catch {
        Object.assign(session, { activeSubscription: null });
      }
      return session;
    },
    async signIn({ user }) {
      try {
        const matchExpression = query.Match(
          query.Index("user_by_email"),
          query.Casefold(user.email!)
        );

        await fauna.query(
          query.If(
            query.Not(query.Exists(matchExpression)),
            query.Create(query.Collection("users"), {
              data: {
                email: user.email!,
              },
            }),
            query.Get(matchExpression)
          )
        );

        return true;
      } catch {
        return false;
      }
    },
  },
});
