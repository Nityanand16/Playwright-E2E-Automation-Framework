# Playwright E2E Automation Framework

A Playwright-based end-to-end automation framework for validating critical user journeys in a web application. The framework is built with TypeScript, follows the Page Object Model, and is prepared for local development as well as CI execution with GitHub Actions.

## Features

* End-to-end UI automation with Playwright
* TypeScript-based test suite
* Page Object Model for maintainable test design
* Reusable helpers for cookies, overlays, popups, and success states
* Parallel execution support
* Cross-browser coverage
* HTML reporting for local runs
* CI-ready GitHub Actions workflow
* Screenshot, video, and trace on failure

## Tech Stack

* Node.js
* Playwright
* TypeScript
* GitHub Actions

## Project Structure

```text
.
├── tests/                  # Test specifications
├── pages/                  # Page objects and reusable screen models
├── components/             # Reusable UI components
├── fixtures/              # Custom Playwright fixtures
├── utils/                  # Helpers and shared utilities
├── playwright.config.ts    # Playwright configuration
├── package.json            # Scripts and dependencies
└── .github/workflows/      # CI workflow files
```

## Prerequisites

* Node.js 18 or later
* npm
* Git

## Installation

```bash
# Clone the repository
git clone https://github.com/Nityanand16/Playwright-E2E-Automation-Framework.git
cd playwright-onskeskyen

# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps
```

## Environment Variables

Create a `.env` file in the project root.

```env
BASE_URL=https://your-app-url.com
```

## Running Tests

### Run all tests

```bash
npx playwright test
```

### Run tests in headed mode

```bash
npx playwright test --headed
```

### Run a specific test file

```bash
npx playwright test tests/complete-signup-wishlist-login.spec.ts
```

### Run in debug mode

```bash
npx playwright test --debug
```

### Show the HTML report

```bash
npx playwright show-report
```

## Scripts

If you want, these scripts can be added to `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report"
  }
}
```

## Playwright Configuration

The project is configured to:

* use the `tests` folder as the test directory
* run with a 90 second test timeout
* retry failed tests in CI
* capture screenshots, videos, and traces on failure
* generate an HTML report locally

## CI Workflow

The GitHub Actions workflow runs on:

* pushes to `main` and `master`
* pull requests targeting `main` and `master`

The pipeline:

1. checks out the code
2. installs Node.js
3. installs dependencies
4. installs Playwright browsers
5. runs Playwright tests
6. uploads the HTML report as an artifact

## Test Design

The framework uses the Page Object Model to keep tests readable and stable.

### Pages and Components

* `HomePage`
* `SignupModal`
* `ProfileModal`
* `LoginModal`
* `NavbarComponent`
* `WishlistPage`
* `ProductPage`
* `CartPopup`

### Utilities

Common helpers are used for:

* accepting cookie banners
* handling optional overlays
* waiting for navigation or success states
* selecting dropdown values

## Best Practices Used

* Prefer stable selectors such as `data-testid`
* Use explicit waits instead of hard delays where possible
* Keep page-specific logic inside page objects
* Keep test data creation isolated from page interactions
* Make CI runs stable with retries and reduced concurrency

## Common Troubleshooting

### Browser not installed

```bash
npx playwright install --with-deps
```

### Tests fail only in CI

* confirm `BASE_URL` is set in GitHub Secrets or repository variables
* verify the app is reachable from the CI runner
* check if a cookie banner or popup is blocking the UI

### Report not generated

* confirm the test run completed
* check that `playwright-report/` exists after the run

## Example End-to-End Flow

A typical test flow in this framework can cover:

* sign up
* profile creation
* logout and login
* wishlist creation
* adding products to wishlist
* navigating to a product store page
* validating cart or popup behavior

## Contributing

1. Create a new branch
2. Make your changes
3. Run the full test suite locally
4. Open a pull request

## License

Add your project license here.
