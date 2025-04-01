# CoCreate-observer

Register a components init function & observe selector. The init function will be fired immedietly after detection of selector. Take it for a spin in our [playground!](https://cocreate.app/docs/observer)

![minified](https://img.badgesize.io/https://cdn.cocreate.app/observer/latest/CoCreate-observer.min.js?style=flat-square&label=minified&color=orange)
![gzip](https://img.badgesize.io/https://cdn.cocreate.app/observer/latest/CoCreate-observer.min.js?compression=gzip&style=flat-square&label=gzip&color=yellow)
![brotli](https://img.badgesize.io/https://cdn.cocreate.app/observer/latest/CoCreate-observer.min.js?compression=brotli&style=flat-square&label=brotli)
![GitHub latest release](https://img.shields.io/github/v/release/CoCreate-app/CoCreate-observer?style=flat-square)
![License](https://img.shields.io/github/license/CoCreate-app/CoCreate-observer?style=flat-square)
![Hiring](https://img.shields.io/static/v1?style=flat-square&label=&message=Hiring&color=blueviolet)

![CoCreate-observer](https://cdn.cocreate.app/docs/CoCreate-observer.gif)

## [Docs & Demo](https://cocreate.app/docs/observer)

For a complete guide and working demo refer to the [doumentation](https://cocreate.app/docs/observer)

# Table of Contents

-   [Table of Contents](#table-of-contents)
-   [Installation](#installation)
-   [Code Examples](#examples)
-   [Parameter Description](#announcements)
-   [Announcements](#announcements)
-   [Roadmap](#roadmap)
-   [Contributing](#contributing)
-   [About](#about)
-   [License](#license)

<a name="installation"></a>## Code Examples

# Installation

You can install CoCreate-observer using the following methods:

**CDN**

```html
<script src="[https://cdn.cocreate.app/observer/latest/CoCreate-observer.min.js](https://cdn.cocreate.app/observer/latest/CoCreate-observer.min.js)"></script>
```

**npm**

```shell
$ npm i @cocreate/observer
```

**yarn**

```shell
$ yarn install @cocreate/observer
```

<a name="examples"></a>

# Code Examples

```javascript
// Initialize an observer
CoCreate.observer.init({
	name: "my-observer",
	types: ["attributes"],
	selector: ".my-element",
	callback: function (mutation) {
		console.log("Mutation occurred:", mutation);
	}
});
```

<a name="parameter"></a>

# Parameter Description

The `init` function takes a configuration object with the following key parameters:

-   `name`: A unique name for the observer.
-   `types`: An array of mutation types to observe (e.g., "childList", "attributes").
-   `selector`: A CSS selector to target elements.
-   `callback`: The function to be executed when a mutation is detected.

<a name="announcements"></a>

# Announcements

All updates to this library are documented in our [CHANGELOG](https://github.com/CoCreate-app/CoCreate-observer/blob/master/CHANGELOG.md) and [releases](https://github.com/CoCreate-app/CoCreate-observer/releases). You may also subscribe to email for releases and breaking changes.

<a name="roadmap"></a>

# Roadmap

If you are interested in the future direction of this project, please take a look at our open [issues](https://github.com/CoCreate-app/CoCreate-observer/issues) and [pull requests](https://github.com/CoCreate-app/CoCreate-observer/pulls). We are currently focused on improving performance for large-scale applications and adding support for custom mutation types. We would love to hear your feedback.

<a name="contribute"></a>

# Contributing

We welcome contributions of all kinds, including bug fixes, new features, documentation improvements, and performance optimizations. We encourage community contributions to our libraries (you might even score some nifty swag), please see our [CONTRIBUTING](https://github.com/CoCreate-app/CoCreate-observer/blob/master/CONTRIBUTING.md) guide for details.

We want this library to be community-driven, and CoCreate led. We need your help to realize this goal. To help make sure we are building the right things in the right order, we ask that you create [issues](https://github.com/CoCreate-app/CoCreate-observer/issues) and [pull requests](https://github.com/CoCreate-app/CoCreate-observer/pulls) or merely upvote or comment on existing issues or pull requests.

We appreciate your continued support, thank you!

<a name="about"></a>

# About

CoCreate-observer is a JavaScript library that simplifies the process of monitoring changes in the DOM (Document Object Model). It provides a robust and efficient way to detect and respond to mutations, such as changes to attributes, additions or removals of nodes, and modifications to text content. CoCreate-observer allows developers to easily register callbacks that are triggered when specific elements matching a selector undergo the specified mutations.

Key features include:

-   Efficient selector matching
-   Debouncing to optimize performance
-   Flexible configuration options
-   Cross-browser compatibility

CoCreate-observer is part of the CoCreate suite of open-source tools designed to accelerate web development and empower developers to build dynamic, interactive applications more efficiently. CoCreate aims to provide a comprehensive and modular ecosystem for modern web development.

Please Email the Developer Experience Team [here](mailto:develop@cocreate.app) in case of any queries.

CoCreate-observer is maintained and funded by CoCreate. The names and logos for CoCreate are trademarks of CoCreate, LLC.

<a name="license"></a>

# License

This software is dual-licensed under the GNU Affero General Public License version 3 (AGPLv3) and a commercial license.

-   **Open Source Use**: For open-source projects and non-commercial use, this software is available under the AGPLv3. The AGPLv3 allows you to freely use, modify, and distribute this software, provided that all modifications and derivative works are also licensed under the AGPLv3. For the full license text, see the [LICENSE file](https://github.com/CoCreate-app/CoCreate-observer/blob/master/LICENSE).

-   **Commercial Use**: For-profit companies and individuals intending to use this software for commercial purposes must obtain a commercial license. The commercial license is available when you sign up for an API key on our [website](https://cocreate.app). This license permits proprietary use and modification of the software without the copyleft requirements of the AGPLv3. It is ideal for integrating this software into proprietary commercial products and applications.

Please ensure you understand and comply with the appropriate license terms for your use case.
