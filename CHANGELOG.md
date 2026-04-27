# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- markdownlint-disable MD024 -->

## [Unreleased]

### Changed

- Reserved for upcoming authentication, deployment, and database-management updates.

## [0.0.9] - 2026-04-23

### Added

- Added support for using remote authentication during local login flows.
- Added CI build secrets and expanded trusted-origin and database URL configuration.
- Added Docker support for exposing Drizzle Studio for database management.

### Changed

- Updated Astro and container startup scripts to better support build and runtime behavior.
- Updated Kong-facing auth path handling and removed the default localhost base URL.
- Adjusted build behavior to keep development dependencies available when Drizzle tooling is required.

### Fixed

- Improved container and local-network behavior for running the service outside the default localhost-only setup.
