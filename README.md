# WEB102 Unit 4 Project: Veni Vici

Submitted by: **Olabode Jimoh**

Veni Vici! is a React + Vite app that uses The Cat API to discover one random cat at a time. Users can view matching breed details and image data, then ban attributes so future discoveries avoid those values.

Time spent: **TBD** hours spent in total

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

TODO: Add a screenshot of the completed app.

## Video Walkthrough

TODO: Add Loom walkthrough link after recording.

## Notes

- The Cat API sometimes returns items without breed data, so the app keeps fetching until it finds a result with matching breed attributes and an image.
- Banned values are checked before a new result is displayed.

## License

Copyright 2026 Olabode Jimoh

Licensed under the Apache License, Version 2.0.
