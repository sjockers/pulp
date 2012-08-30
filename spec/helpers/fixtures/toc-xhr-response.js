var TocResponse = {
  failure: [
    404,
    { "Content-Type": "text/HTML" },
    "<!DOCTYPE html><html><head><title>404 Page Not Found</title></head><body><h1>Status: 404 Page Not Found</h1></body></html>"
  ],
  
  success: [ 
    200, 
    { "Content-Type": "text/HTML" },
    '<!DOCTYPE html><html><head><title>TOC</title></head><body><ul><li itemscope data-properties="self"><h1 itemprop="title"><a href="toc.html" itemprop="url">The Daily Gazette</a></h1></li><li itemscope><h3 itemprop="title"><a href="article-1.html" itemprop="url">First Article</a></h3><p itemprop="byline">By John Johnson</p></li><li itemscope><h3 itemprop="title"><a href="article-2.html" itemprop="url">Second Article</a></h3><p itemprop="byline">By Jane Jackson</p></li><li itemscope><h3 itemprop="title"><a href="article-3.html" itemprop="url">Third Article</a></h3><p itemprop="byline">By Jane Jackson</p></li> </ul></body></html>'
  ]
}

/* success response, pretty printed: 

<!DOCTYPE html>

<html>

<head>
  <title>TOC</title>
</head>

<body>
  
  <ul>  
    <li itemscope data-properties="self">
      <h1 itemprop="title">
        <a href="toc.html" itemprop="url">The Daily Gazette</a>
      </h1>
    </li>

    <li itemscope>
      <h3 itemprop="title"><a href="article-1.html" itemprop="url">First Article</a></h3>
      <p itemprop="byline">By John Johnson</p>
    </li>

    <li itemscope>
      <h3 itemprop="title"><a href="article-2.html" itemprop="url">Second Article</a></h3>
      <p itemprop="byline">By Jane Jackson</p>
    </li>
  
    <li itemscope>
      <h3 itemprop="title"><a href="article-3.html" itemprop="url">Third Article</a></h3>
      <p itemprop="byline">By Jane Jackson</p>
    </li> 
  </ul>

</body>
</html>
*/