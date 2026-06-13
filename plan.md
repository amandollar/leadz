# Agency CRM - MVP Plan

## Tech Stack

* Rails 8
* Inertia.js
* React
* PostgreSQL
* TailwindCSS

## Goals

* Learn Rails 8
* Learn Inertia.js
* Learn React with Rails
* Build a realistic business application
* Manage agency leads and sales pipeline
* No external APIs
* No payment gateways
* No email integrations
* No AI integrations

---

# Phase 1 - Authentication

## Users

Fields:

* Name
* Email
* Password Digest
* Role

Roles:

* Admin
* Manager
* Sales Rep
* Intern

Features:

* Login
* Logout
* Change Password

Notes:

* Use Rails `has_secure_password`
* No signup page
* No forgot password
* No email verification

---

# Phase 2 - Workspace

## Workspace

Fields:

* Name

Features:

* One workspace for MVP
* Users belong to workspace
* Leads belong to workspace

Purpose:

* Future-proof database structure
* Easy migration to multi-tenant SaaS later

---

# Phase 3 - Lead Management

## Lead

Fields:

* Business Name
* Contact Name
* Email
* Phone
* Website
* Industry
* City
* Notes

Relationships:

* Belongs To Workspace
* Belongs To Owner (User)

Features:

* Create Lead
* Edit Lead
* View Lead
* Archive Lead
* Search Leads
* Filter Leads

---

# Phase 4 - Lead Pipeline

## Lead Stages

Stages:

* New
* Contacted
* Interested
* Meeting Scheduled
* Proposal Sent
* Negotiation
* Won
* Lost

Features:

* Change Lead Stage
* Kanban Board
* Stage History

Purpose:

* Visual sales pipeline
* Core CRM functionality

---

# Phase 5 - Activities

## Activity

Track every interaction with a lead.

Activity Types:

* Call
* WhatsApp
* Email
* Meeting
* Note

Fields:

* Lead
* User
* Type
* Notes

Features:

* Add Activity
* Activity Timeline
* View Lead History

Example Timeline:

* Called business owner
* Sent proposal
* Follow-up meeting scheduled

---

# Phase 6 - Follow Ups

## Follow Up

Fields:

* Lead
* Due Date
* Notes
* Status

Status:

* Pending
* Completed
* Missed

Features:

* Schedule Follow Up
* Mark Completed
* View Upcoming Follow Ups
* View Overdue Follow Ups

---

# Phase 7 - Lead Assignment

Features:

* Assign Lead To User
* Reassign Lead
* View Assigned Leads

Permissions:

* Admin can assign leads
* Manager can assign leads
* Sales Rep can manage assigned leads

---

# Phase 8 - Dashboard

## Personal Dashboard

Cards:

* My Leads
* My Pending Follow Ups
* My Won Deals
* My Lost Deals

## Manager Dashboard

Cards:

* Total Leads
* Leads By Stage
* Pending Follow Ups
* Team Performance

---

# Phase 9 - Reports

## Lead Reports

* Leads Created
* Leads Won
* Leads Lost
* Conversion Rate

## Pipeline Reports

* Leads Per Stage
* Stage Conversion Rates

## User Reports

* Leads Assigned
* Deals Won
* Follow Ups Completed

---

# Phase 10 - Audit Logs

Track:

* Lead Created
* Lead Updated
* Lead Assigned
* Stage Changed
* Follow Up Created
* Follow Up Completed

Purpose:

* Accountability
* Change Tracking

---

# Database Relationships

Workspace

* has_many Users
* has_many Leads

User

* belongs_to Workspace
* has_many Owned Leads
* has_many Activities

Lead

* belongs_to Workspace
* belongs_to Owner (User)
* has_many Activities
* has_many Follow Ups

Activity

* belongs_to Lead
* belongs_to User

Follow Up

* belongs_to Lead

Audit Log

* belongs_to User
* polymorphic reference to tracked record

---

# MVP Completion Criteria

A sales team should be able to:

1. Login
2. Create leads
3. Assign leads
4. Move leads through a sales pipeline
5. Record activities
6. Schedule follow ups
7. Track lead history
8. View dashboards
9. Generate reports

---

# Features Explicitly Excluded From MVP

* Forgot Password
* Email Verification
* Magic Links
* Notifications
* SMS
* WhatsApp Integration
* Payment Processing
* AI Features
* External APIs
* Calendar Sync
* Multi-Workspace Support
* Public Signup

---

# Learning Outcomes

This project demonstrates:

* Authentication
* Authorization
* CRUD Operations
* Associations
* Service Objects
* Query Optimization
* Dashboard Design
* Reporting
* Audit Logging
* Business Logic
* Rails + Inertia Architecture
* Production-Style SaaS Development
