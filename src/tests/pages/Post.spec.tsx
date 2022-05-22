import { render, screen } from "@testing-library/react";
import { getServerSession } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

jest.mock("next-auth/react");
const useSessionMocked = jest.mocked(useSession);

jest.mock("../../services/prismic");

const post = {
  slug: "my-post",
  title: "My Post",
  content: "<p>post excerpt</p>",
  updateAt: "02-02-2022",
};

describe("Post page", () => {
  it("renders correctly", () => {
    useSessionMocked.mockReturnValueOnce({ data: null, status: "loading" });
    render(<Post post={post} />);
    expect(screen.getByText("My Post")).toBeInTheDocument();
    expect(screen.getByText("post excerpt")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = jest.mocked(getSession);
    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: "my-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/posts/preview/my-post",
        }),
      })
    );
  });

  it("loads initial data", async () => {
    const getSessionMocked = jest.mocked(getSession);
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription",
    } as any);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "My new post" }],
          content: [{ type: "paragraph", text: "My post" }],
        },
        last_publication_date: "02-02-2022",
      }),
    } as any);

    const response = await getServerSideProps({
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
