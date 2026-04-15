import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { NavBar } from '../../src/components/NavBar'
import { Footer } from '../../src/components/Footer'

const blogPosts = [
  {
    slug: 'nvidia-nemotron-3',
    title: 'NVIDIA Nemotron 3: The Open Model Family Redefining Enterprise AI',
    excerpt: 'A deep dive into NVIDIA\'s Nemotron 3 model family - how it\'s reshaping enterprise AI with open weights, synthetic data generation, and unmatched customization capabilities.',
    date: 'April 15, 2026',
    readTime: '8 min read',
    tags: ['AI/ML', 'NVIDIA', 'LLM', 'Enterprise AI'],
    featured: true,
  },
]

const Blog: NextPage = () => {
  return (
    <>
      <Head>
        <title>Blog - Mayur Dhavan | Tech Insights & Tutorials</title>
        <meta name="description" content="Read about the latest in AI, web development, and emerging technologies. Written by Mayur Dhavan." />
        <meta property="og:title" content="Blog - Mayur Dhavan" />
        <meta property="og:description" content="Tech insights, tutorials, and deep dives into AI and modern web development." />
        <meta property="og:type" content="website" />
      </Head>
      <div className="App">
        <div className="app-content">
          <NavBar />
          <section className="blog-page">
            <div className="blog-hero">
              <div className="container">
                <h1 className="blog-hero-title">Blog</h1>
                <p className="blog-hero-subtitle">
                  Deep dives into AI, web development, and the tech shaping our future.
                </p>
              </div>
            </div>
            <div className="container">
              <div className="blog-grid">
                {blogPosts.map((post) => (
                  <Link href={`/blog/${post.slug}`} key={post.slug} className="blog-card-link">
                    <article className={`blog-card ${post.featured ? 'blog-card-featured' : ''}`}>
                      <div className="blog-card-accent" />
                      <div className="blog-card-content">
                        <div className="blog-card-meta">
                          <span className="blog-card-date">{post.date}</span>
                          <span className="blog-card-separator">|</span>
                          <span className="blog-card-read-time">{post.readTime}</span>
                        </div>
                        <h2 className="blog-card-title">{post.title}</h2>
                        <p className="blog-card-excerpt">{post.excerpt}</p>
                        <div className="blog-card-tags">
                          {post.tags.map((tag) => (
                            <span key={tag} className="blog-tag">{tag}</span>
                          ))}
                        </div>
                        <span className="blog-card-cta">
                          Read Article <span className="cta-arrow">&rarr;</span>
                        </span>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Blog
