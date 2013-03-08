---
layout: post
title: "Symfony2: Caching a Rest API"
description: ""
category: symfony2
tags: [symfony2, php]
---
{% include JB/setup %}

As part of a project I'm currently working on, I needed to create a Rest API as a facade into an old legacy database.

Some of the data I was retrieving from this legacy database was quite large and quite complex, one particular endpoint for example would take approx. 10 seconds to load. This is simply far to slow to service the client that would be consuming this data and so it soon became obvious that some caching was required to ensure that data was loaded quickly.

I knew I needed some kind of data caching, and I had planned to take full advantage of the expiration model of HTTP caching as much as possible, however due to the dynamic nature of the data, I knew I needed a flexible validation model of HTTP caching to ensure maximum efficiency from the API.

I was in the fortunate position that the client consuming this endpoint was being developed by our team also. Therefore, as long as the Rest API returned appropriate caching headers, I could also set the appropriate caching headers to make use of these within my client. HTTP Caching was a go.

Symfony2 has excellent support for HTTP Caching. If you haven't done so already, I would highly recommend [reading the \(f\*\*\*\*ng\) manual on it](http://symfony.com/doc/current/book/http_cache.html).

What I wanted was to cache a particular endpoint "forever" until a record within the result set of the endpoint was updated. So for example, if you hit the following endpoint:

```http://acme.com/things```

It should **always** return a cached version of *things*, unless a *thing* has been updated since the last time the endpoint was called.

So what I needed to do was to work out when a *thing* was last updated **before** the main query was run and change the response. 

## Getting the last modified date

This was simple enough, just add something along the lines of the following to the appropriate repository class:

<script src="https://gist.github.com/4667994.js"> </script>

So now we have a cheap way of getting the the last modified thing, or a last modified date for our endpoint.

## Using last modified date to alter the response

The problem I had now was how to look up this date and alter the response if necessary. 

I could have done what they have in [the example on the Symfony docs](http://symfony.com/doc/current/book/http_cache.html#validation-with-the-last-modified-header) however this wasn't very flexible, as it meant adding a lot of duplicated code to every action. I wanted something much more flexible. I wanted to make a controller cacheable with minimum effort required.

My solution for this was to use a listener:

<script src="https://gist.github.com/4668158.js"> </script>

What this does is before the controller is used, checks to see if it implements "Cacheable" and if it does will check the last modified date and then change the action it will call on the controller (and thus the response) accordingly.

Here is the code for the interface:

<script src="https://gist.github.com/4668261.js"> </script>

So all that's left to do then is to add three methods as stipulated in our interface - isNotModified(), getLastModifiedDate() and getLastModifiedResponse().

It makes sense for isNotModified() and getLastModifiedResponse() to live in an abstract parent class as these are unlikely to change across multiple controllers:

<script src="https://gist.github.com/4668398.js"> </script>

It is simply then a case of adding a getLastModifiedDate() to the children controllers, for example:

<script src="https://gist.github.com/4668420.js"> </script>

You should now have an unobtrusive way of setting a 304 response for endpoints on your API. Of course this relies on the appropriate headers being sent by the client consuming this service. This is easy using something like Guzzle, but more on that in another post.