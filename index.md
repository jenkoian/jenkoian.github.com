---
layout: page
title: Jenko
tagline: Words & Code and Words about Code
---
{% include JB/setup %}

{% for post in site.posts limit: 1 %}
  <header class="clearfix">
    <span class="date">{{ post.date | date_to_long_string }}</span>
    <h1><a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></h1>
    <span class="category"><a href="{{ BASE_PATH }}/categories.html#{{ post.category }}-ref">{{ post.category }}</a></span>
    <span class="time">{{ post.content | strip_html | readingtime }}</span>
  </header>
  {{ post.content }}        
{% endfor %}

<a href="{{ BASE_PATH }}{{ site.JB.archive_path }}">&laquo; other posts</a>