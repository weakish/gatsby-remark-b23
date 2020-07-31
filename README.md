<div align="center">
<h3>gatsby-remark-bilibili</h3>
<p>Transform bilibili video link to embed bilibili video playar<p>
</div>

### Why?

Inspired by [gatsby-remark-ombed](https://github.com/raae/gatsby-remark-oembed) and [gatsby-remark-embedder](https://github.com/MichaelDeBoey/gatsby-remark-embedder), I would like to embed bilibili player in markdown using markdown by combining features from these two plugins.

### Usage

#### Use gatsby-transformer-remark

```js
  {
    resolve: `gatsby-transformer-remark`,
    options: {
      plugins: [
        {
          resolve: `@tizee/gatsby-remark-b23`,
          options: {
              prefix: "embed"
          }
        }
      ]
    }
  }
```

#### Use gatsby-transformer-mdx

```js
{
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: ['.mdx', '.md'],
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-magic`,
            options: {
              prefix: 'embed',
            },
          },
      }
}
```

#### With prefix

In your markdown file, use a prefix in inline code.

```markdown
`embed https://bilibili.com/video/BV1YV411r7ns`
```

It will be transformed to:

```markdown
<iframe width="100%" height="400" src="https://player.bilibili.com/player.html?bvid=BV1YV411r7ns" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe
```

#### Without prefix

You need to put the link surronded by empty lines as a parapgraph.

```markdown
https://bilibili.com/video/BV1YV411r7ns
```

It will be transformed to:

```markdown
<iframe width="100%" height="400" src="https://player.bilibili.com/player.html?bvid=BV1YV411r7ns" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe
```
