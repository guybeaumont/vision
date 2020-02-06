import React from 'react';
import { graphql } from 'gatsby';
import { logicDescription } from '../logic';
import Layout from '../components/Layout';
import Basic from '../components/section/Basic';
import Image from '../components/unit/Image';

export default ({ location, data }) => {
    const { resource } = data;
    return (
        <Layout
            template={`single single-resource single-resource-${resource.slug}`}
            title={resource.title}
            description={logicDescription(resource)}
            location={location}
        >
            <Basic space="space-xs-50 space-lg-80">
                <div className="row align-items-center gutter-80">
                    <div className="col-lg-6">
                        <figure className="cheat-left">
                            <Image className="image" source={resource.image.fluid} alternate={resource.title} />
                        </figure>
                    </div>
                    <div className="col-lg-6">
                        <header>
                            <h1 className="title">{resource.title}</h1>
                            {resource.author && <p className="author">{resource.author.name}</p>}
                            {resource.reviewer && <p className="reviewer">Medically reviewed by: {resource.reviewer.name}</p>}
                            <p className="reviewed">Medically reviewed date: {resource.reviewed}</p>
                        </header>
                    </div>
                </div>
            </Basic>
            <Basic space="space-xs-50 space-lg-80">
                <div className="row gutter-80">
                    <div className="col-lg-9">
                        <header className="node-xs-50 node-lg-80">
                            <h2 className="summary" dangerouslySetInnerHTML={{ __html: resource.excerpt.excerpt }} />
                        </header>
                        <article className="node-xs-50 node-lg-80">
                            <header className="node-xs-50">
                                <h3 className="section-title">Introduction</h3>
                            </header>
                            <section className="node-xs-50" dangerouslySetInnerHTML={{ __html: resource.head.childMarkdownRemark.html }} />
                        </article>
                        <article className="node-xs-50 node-lg-80">
                            <section className="section-group" dangerouslySetInnerHTML={{ __html: resource.body.childMarkdownRemark.html }} />
                        </article>
                        <article className="node-xs-50 node-lg-80">
                            <section className="section-group" dangerouslySetInnerHTML={{ __html: resource.foot.childMarkdownRemark.html }} />
                        </article>
                        <footer className="node-xs-50 node-lg-80">
                            <header className="node-xs-50">
                                <h3 className="section-title">References</h3>
                            </header>
                            <section className="extra node-xs-50" dangerouslySetInnerHTML={{ __html: resource.extra.childMarkdownRemark.html }} />
                        </footer>
                    </div>
                    <div className="col-lg-3 d-none">
                        <aside>Menu</aside>
                    </div>
                </div>
            </Basic>
        </Layout>
    );
};

export const query = graphql`
    query resourceBySlug($slug: String!) {
        resource: contentfulResource(slug: { eq: $slug }) {
            id
            title
            slug
            image {
                ...imageResource
            }
            head {
                childMarkdownRemark {
                    html
                    excerpt
                }
            }
            body {
                childMarkdownRemark {
                    html
                    excerpt
                }
            }
            foot {
                childMarkdownRemark {
                    html
                    excerpt
                }
            }
            extra {
                childMarkdownRemark {
                    html
                    excerpt
                }
            }
            author {
                name
            }
            reviewer {
                name
            }
            reviewed(formatString: "MMMM D, YYYY")
            excerpt {
                excerpt
            }
        }
    }
`;
