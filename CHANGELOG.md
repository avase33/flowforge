# Changelog

## [Unreleased]
### Added
- Visual pipeline editor with React Flow drag-and-drop canvas
- 50+ built-in trigger and action nodes
- Live execution log streaming via WebSocket
- Conditional branching: if/else, switch, filter nodes
- Cron-based workflow scheduling
- GitHub, Slack, and Stripe trigger integrations
- Workflow versioning and rollback
- Shareable webhook endpoints per workflow

## [0.1.0] - 2026-06-22
### Added
- Initial release: workflow CRUD API
- Execution engine with topological node ordering
- PostgreSQL persistence via Prisma
- Redis-backed job queue with Bull
- React canvas UI with sidebar navigation
- Docker Compose deployment
- GitHub Actions CI pipeline