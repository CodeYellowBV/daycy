# DayCY
Simple date (range) picker for React based on Semantic-UI.

[**Demo / overview of all components**](https://CodeYellowBV.github.io/daycy/)

## Usage
To use DayCY you will have to install the package first. (Since DayCY uses
Semantic-UI styling you will also need to install `semantic-ui-css`.)
```
npm install semantic-ui-css
npm install daycy
```
We will also need to include the CSS. The easiest way to do this is to have
your babel setup in such a way that you can import CSS.
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
