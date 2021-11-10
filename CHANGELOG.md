# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2021-11-03
### Added
- Added nullable property to `Calendar`, `DatePicker`, `DateRangePicker`, and `WeekPicker` that allow set value to null. Property nullable is as a default set to false.

## [0.5.1] - 2021-11-03
### Fixed
- Fixed `MonthPicker` to correctly forward the value to `MonthInput`.
### Changed
- Updated the storybook to properly maintain state for a better demo experience.

## [0.5.0] - 2021-11-03
### Added
- Added components `MonthPicker`, `MonthInput`, and `MonthCalendar` that allow for month selection.

## [0.4.11] - 2021-04-30
### Changed
- Changed all components to leave the part of the date that they do not change the same. So a time picker does not change the date and a date picker does not change the time.

## [0.4.10] - 2020-09-10
### Added
- Added support for `noPopup` prop to all picker components.

## [0.4.9] - 2020-08-28
### Added
- Added support for `disabled` to `DateRangePicker` and `TimeRangePicker`.

## [0.4.8] - 2020-07-30
### Changed
- Changed open/close of calendar/clock to be more tightly coupled to the focus state of the input.

## [0.4.7] - 2020-07-14
### Fixed
- Fix issue with onChange in `DateInput`.

## [0.4.6] - 2020-07-14
### Added
- Added support for more formats for smart typing in `DateInput`.

## [0.4.5] - 2020-07-14
### Fixed
- Fixed some issues with date format pipes in `DateInput`.

## [0.4.4] - 2020-07-14
### Added
- Make `DateInput` support smart typing validation for certain date formats.

## [0.4.3] - 2020-01-20
### Changed
- Make `TimeInput` inherit from `DateInput`.

## [0.4.2] - 2020-01-09
### Fixed
- Fixed issue in clock where AM/PM would not work correctly.

## [0.4.1] - 2020-01-09
### Fixed
- Fixed issue in clock where minutes would display as 60 instead of 0.

## [0.4.0] - 2020-01-09
### Added
- Added `TimeInput`, `TimePicker` and `TimeRangePicker`.

## [0.3.1] - 2019-11-28
### Fixed
- Fixed initial state for `typeValue` in `DateInput`

## [0.3.0] - 2019-11-27
### Added
- Add the ability to type to `DatePicker` and `DateRangePicker`.

## [0.2.0] - 2019-07-24
### Added
- Add `WeekPicker` component.
### Changed
- Change usage of `week.number` translation key to receive argument `week`
instead of `weekNumber`.

## [0.1.5] - 2019-07-23
### Added
- Add `onWeekSelect` property to `DatePicker` to determine what should happen
when someone selects a week in the `DatePicker`.

## [0.1.4] - 2019-07-04
### Added
- Add `includeWeeks` property to both `DatePicker` and `DateRangePicker` for
displaying week numbers to the calendar. For `DateRangePicker` this week number
can also be clicked to select this week as your range.

## [0.1.3] - 2019-06-13
### Added
- Add fluid property to `DatePicker` and always enable it when it is inside a
Semantic UI Form.

## [0.1.2] - 2019-06-04
### Fixed
- Fix `configureTranslation` so that it actually does what it says it does.

## [0.1.1] - 2019-06-04
### Added
- Make `DateRangePicker` always fluid when it is inside a Semantic UI Form.

## [0.1.0] - 2019-05-23
### Added
- First version of this project.

[0.4.10]: https://github.com/CodeYellowBV/daycy/compare/v0.4.9...v0.4.10
[0.4.9]: https://github.com/CodeYellowBV/daycy/compare/v0.4.8...v0.4.9
[0.4.8]: https://github.com/CodeYellowBV/daycy/compare/v0.4.7...v0.4.8
[0.4.7]: https://github.com/CodeYellowBV/daycy/compare/v0.4.6...v0.4.7
[0.4.6]: https://github.com/CodeYellowBV/daycy/compare/v0.4.5...v0.4.6
[0.4.5]: https://github.com/CodeYellowBV/daycy/compare/v0.4.4...v0.4.5
[0.4.4]: https://github.com/CodeYellowBV/daycy/compare/v0.4.3...v0.4.4
[0.4.3]: https://github.com/CodeYellowBV/daycy/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/CodeYellowBV/daycy/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/CodeYellowBV/daycy/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/CodeYellowBV/daycy/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/CodeYellowBV/daycy/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/CodeYellowBV/daycy/compare/0.2.0...v0.3.0
[0.2.0]: https://github.com/CodeYellowBV/daycy/compare/0.1.5...0.2.0
[0.1.5]: https://github.com/CodeYellowBV/daycy/compare/0.1.4...0.1.5
[0.1.4]: https://github.com/CodeYellowBV/daycy/compare/0.1.3...0.1.4
[0.1.3]: https://github.com/CodeYellowBV/daycy/compare/0.1.2...0.1.3
[0.1.2]: https://github.com/CodeYellowBV/daycy/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/CodeYellowBV/daycy/compare/0.1.0...0.1.1
[0.1.0]: https://github.com/CodeYellowBV/daycy/tree/0.1.0
