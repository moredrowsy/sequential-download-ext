# Sequential downlaoder for Chrome/Firefox extension

A simple sequential downloader for the browser extension.

I started this project to practice React, browser extension APIs and
my programming skills.

## Example

Input a link with the following pattern inside brackets [ ]

    http://www.example.com/image_[000:005].jpg

Click on '>>' button and it will produce the following links

    http://www.example.com/image_000.jpg
    http://www.example.com/image_001.jpg
    http://www.example.com/image_002.jpg
    http://www.example.com/image_003.jpg
    http://www.example.com/image_004.jpg
    http://www.example.com/image_005.jpg

Set browser to not ask for download location dialogue so it can automate without
user interaction.
