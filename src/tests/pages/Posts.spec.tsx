import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { getPrismicClient } from "../../services/prismic";
import Posts, { getStaticProps } from "../../pages/posts";

jest.mock("next-auth/react");
const useSessionMocked = jest.mocked(useSession);

jest.mock("../../services/prismic");

const posts = [
  {
    slug: "my-post",
    title: "My Post",
    excerpt: "post excerpt",
    updateAt: "02-02-2022",
  },
];

describe("Posts page", () => {
  it("renders correctly", () => {
    useSessionMocked.mockReturnValueOnce({ data: null, status: "loading" });
    render(<Posts posts={posts} />);
    expect(screen.getByText("My Post")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "my-post",
            data: {
              title: [{ type: "heading", text: "My new post" }],
              content: [{ type: "paragraph", text: "My post" }],
            },
            last_publication_date: "02-02-2022",
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "my-post",
              title: "My new post",
              excerpt: "My post",
              updateAt: "02 de fevereiro de 2022",
            },
          ],
        },
      })
    );
  });
});
