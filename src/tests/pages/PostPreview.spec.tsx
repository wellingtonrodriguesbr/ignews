import { render, screen } from "@testing-library/react";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("next-auth/react");
jest.mock("next/router");
const useSessionMocked = jest.mocked(useSession);

jest.mock("../../services/prismic");

const post = {
  slug: "my-post",
  title: "My Post",
  content: "<p>post excerpt</p>",
  updateAt: "02-02-2022",
};

describe("Post preview page", () => {
  it("renders correctly", () => {
    useSessionMocked.mockReturnValueOnce({ data: null, status: "loading" });

    render(<Post post={post} />);
    expect(screen.getByText("My Post")).toBeInTheDocument();
    expect(screen.getByText("post excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);
    const pushMocked = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        expires: "fake-expires",
        activeSubscription: "fake-active-subscription",
      },
      status: "authenticated",
    });

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    render(<Post post={post} />);

    expect(pushMocked).toHaveBeenCalledWith("/posts/my-post");
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "My new post" }],
          content: [{ type: "paragraph", text: "My post" }],
        },
        last_publication_date: "02-02-2022",
      }),
    } as any);

    const response = await getStaticProps({
      params: { slug: "my-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-post",
            title: "My new post",
            content: "<p>My post</p>",
            updateAt: "02 de fevereiro de 2022",
          },
        },
      })
    );
  });
});
