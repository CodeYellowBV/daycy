# DayCY
[![npm](https://img.shields.io/npm/v/daycy.svg)](https://www.npmjs.com/package/daycy/)

Simple date (range) picker for React based on Semantic-UI.

[**Demo / overview of all components**](https://CodeYellowBV.github.io/daycy/)

## Install
```
npm install daycy
```

## Usage
First we will have to include the CSS. The easiest way to do this is to have
your babel setup in such a way that you can import CSS. DayCY also needs the
CSS from Semantic UI.
```
npm install semantic-ui-css
```
```jsx
import 'semantic-ui-css/semantic.min.css';
import 'daycy/dist/daycy.css';
```
This has the added benefit of automatically keeping the CSS in sync with the
version of the package you have installed.

## Internationalization
By default the calendar popup will use English names for the months and days of
the week. To override this you can change the translation function.
```
import { configureTranslation } from 'daycy';

function myTranslationFunction(key) {
    // Insert your logic here
}

configureTranslation(myTranslationFunction);
```
