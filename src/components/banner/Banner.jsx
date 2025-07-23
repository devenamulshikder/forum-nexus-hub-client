/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { Loader } from "../shared/Loader";
import { AnnouncementList } from "../announcementList/AnnouncementList";
import {
  FaSearch,
  FaChartBar,
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaRegSadTear,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { TagsSection } from "../tagsSection/TagsSection";
import { Link } from "react-router";

export const Banner = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTag, setSearchTag] = useState("");
  const [debouncedSearchTag, setDebouncedSearchTag] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 5;
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTag(searchTag);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTag]);
  const {
    data: postData = {},
    refetch,
    isPending,
  } = useQuery({
    queryKey: ["post", debouncedSearchTag, sort, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/post?tag=${debouncedSearchTag}&sort=${sort}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });

  const posts = postData.data || [];
  const totalPages = postData.totalPages || 1;
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };
  const handleTagClick = (tagName) => {
    setSearchTag(tagName);
    setPage(1);
    refetch();
  };

  return (
    <section className="bg-gradient-to-br from-[#F8F9FF] to-[#EBEDFA] py-12 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
            Welcome to Forum Nexus Hub
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mt-4 mb-8 max-w-3xl mx-auto">
            Join our community of passionate developers. Share knowledge, ask
            questions, and grow together in the world of technology.
          </p>

          {/* Search Form */}
          <motion.form
            onSubmit={handleSearch}
            className="flex gap-2 mb-8 max-w-2xl mx-auto"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by full tag name..."
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6D7CFF] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </motion.form>
          {/* Display search results info */}
          {searchTag && (
            <div className="text-center mb-6">
              {posts.length === 0 && !isPending ? (
                <>
                  <p className="text-gray-500 mt-2">
                    No posts found with this tag{" "}
                    <span className="font-medium">"{searchTag}"</span>
                    <span
                      className="text-[#6D7CFF] cursor-pointer ml-2 hover:underline"
                      onClick={() => {
                        setSearchTag("");
                        refetch();
                      }}
                    >
                      Clear search
                    </span>
                  </p>
                </>
              ) : (
                <>
                  {" "}
                  <p className="text-md text-gray-500">
                    Showing results for tag:{" "}
                    <span className="font-medium">"{searchTag}"</span>
                    <span
                      className="text-[#6D7CFF] cursor-pointer ml-2 hover:underline"
                      onClick={() => {
                        setSearchTag("");
                        refetch();
                      }}
                    >
                      Clear search
                    </span>
                  </p>
                </>
              )}
            </div>
          )}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
                Latest Discussions
              </h2>
              <motion.button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <select
                  className="px-4"
                  name="sort"
                  id="sort"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="popular">Popularity</option>
                  <option value="newest">Newest</option>
                </select>
              </motion.button>
            </div>

            {/* Posts Grid */}
            {isPending ? (
              <Loader />
            ) : (
              <>
                {posts.length === 0 ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl shadow-md border border-gray-200 px-6 py-10  text-center"
                    >
                      <div className="flex justify-center mb-4 text-gray-400 text-5xl">
                        <FaRegSadTear />
                      </div>
                      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                        No Post Found
                      </h1>
                      <p className="text-gray-500">
                        Sorry, we couldn't find any post with that tag or
                        keyword. Try searching with different terms.
                      </p>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <div className="space-y-6">
                      {posts.map((post) => (
                        <motion.div
                          key={post._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <Link to={`/post/${post._id}`}>
                            <div className="p-6">
                              {/* Author Info */}
                              <div className="flex items-center gap-3 mb-4">
                                <img
                                  src={post.image}
                                  alt="Author"
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 rounded-full object-cover border-2 border-[#6D7CFF]/30"
                                />
                                <div>
                                  <h3 className="font-semibold">{post.name}</h3>
                                  <p className="text-sm text-gray-500">
                                    {new Date(
                                      post.createdAt
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>

                              {/* Post Content */}
                              <div className="mb-4">
                                <h2 className="text-xl font-bold mb-2 text-gray-800 hover:text-[#6D7CFF] transition-colors">
                                  {post.title}
                                </h2>
                                <p className="mb-2 text-gray-600">
                                  {post.description ||
                                    "No description provided"}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {post.tags.map((tag, i) => (
                                    <span
                                      key={i}
                                      className="px-3 py-1 bg-[#6D7CFF]/10 text-[#6D7CFF] text-sm rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Engagement Metrics */}
                              <div className="flex items-center gap-4 text-gray-600">
                                <div className="flex items-center gap-1">
                                  <FaThumbsUp className="text-green-500" />
                                  <span>{post.upVote}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FaThumbsDown className="text-red-500" />
                                  <span>{post.downVote}</span>
                                </div>
                                <Link
                                  to={`/comment/${post._id}`}
                                  className="flex items-center gap-1"
                                >
                                  <FaComment className="text-[#6D7CFF]" />
                                  <span>{post.commentCount}</span>
                                </Link>
                                <div className="flex items-center gap-1">
                                  <FaChartBar className="text-[#A167FF]" />
                                  <span>
                                    Score: {post.upVote - post.downVote}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full ${
                      page === i + 1
                        ? "bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Announcement Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <TagsSection onTagClick={handleTagClick} activeTag={searchTag} />
            <AnnouncementList />
          </div>
        </div>
      </div>
    </section>
  );
};
