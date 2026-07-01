# WEB102 Unit 4 Project: Veni Vici

Submitted by: **Olabode Jimoh**

Veni Vici! is a React + Vite app that uses The Cat API to discover one random cat at a time. Users can view matching breed details and image data, then ban attributes so future discoveries avoid those values.

Time spent: **8** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] Application features a Discover button that creates a new API fetch request on click and displays at least three attributes and an image from the returned JSON data
- [x] Only one item/API call is viewable at a time and at least one image is displayed per API call
- [x] API call response results appear random to the user
- [x] Clicking on a displayed value for one attribute adds it to a displayed ban list
- [x] Attributes on the ban list prevent further images/API results with that attribute from being displayed

The following **stretch** features are implemented:

- [x] Multiple types of attributes are clickable and can be added to the ban list
- [x] Users can see a stored history of their previously viewed items from this session
- [x] Each history item can be clicked to display that previous item again

## Screenshot

<img src="./public/screenshots/app-demo.png" alt="Veni Vici app screenshot with cat result, attributes, and ban list" width="700" />

## Video Walkthrough

[Video Walkthrough](https://www.loom.com/share/14e1c00eb224437ea7e8f45a00466992)

## Notes

- The Cat API sometimes returns image results without embedded breed data, so the app falls back to breed details and a breed-specific image request.
- Banned values are checked before a new result is displayed so future discoveries avoid selected attributes.

## License

Copyright 2026 Olabode Jimoh

Licensed under the Apache License, Version 2.0.
