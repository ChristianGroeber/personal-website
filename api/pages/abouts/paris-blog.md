# About my Paris Blog
Firstly, this is a very simple blog I created during my 3-week stay in Paris.

Since I'm into street photography, my goal was to get out and take pictures of the streets of paris and the people walking them, every single day. And I achieved that. Going along that, I created a blog post every single day, written in French.

The original inspiration for this came, when my class had created a kind of job-fare, where different companies could come and meet us. There, we all learned that, what we were learning in school, would in no way sufficiently prepare us for the internship we all had to attend a year later. I realised that I needed some things to show as a reference for my work, and my interest in the field, to help me with my job search, so I created this website.

## What's behind it?
It's a very basic HTML and CSS website, using a bootstrap template. But I was not good enough with databases yet, so I needed a different way to load data into the site, without having to edit the actual HTML. (Since finishing the project I moved all the entries to just one static HTML file, since I won't be editing it anymore anyways). 

The answer: Google Sheets.

[Using this repository](https://github.com/jsoma/tabletop) I was able to load the content from [this](https://docs.google.com/spreadsheets/d/1pJLzT0IvPCncO4QvEsScLSix2IN_atqA25H1ZtWe6Fs/edit?usp=sharing) google sheet table. 

You can still look at the webiste with the content loaded dynamically if you pull [the branch `dynamic`](https://github.com/ChristianGroeber/Paris-Blog/tree/dynamic)

The Gallery page is written in PHP and it scans a specific directory for subdirectories, with pictures in them, and it displays those to the user.

## Conclusion
This project was an amazing exercise and a big motivation to go out and take pictures. It is what inspired me last year to start creating websites for my diaries