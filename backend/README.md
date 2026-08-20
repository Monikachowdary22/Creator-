# CreatorIQ API

CreatorIQ is a FastAPI and PostgreSQL-based backend for creator content analytics and social media integration.

The application provides APIs for managing creators, content, audience data, growth data, analytics, and social media synchronization.

## Project Overview

CreatorIQ follows this workflow:

YouTube API
↓
YouTube Service
↓
Data Transformation
↓
PostgreSQL
↓
Analytics Service
↓
FastAPI APIs
↓
Dashboard-ready Data

The system uses a common content format so analytics can work across multiple social media platforms.

## System Architecture

```text
Creator / User
      ↓
FastAPI
      ↓
Routers
      ↓
Services
      ↓
PostgreSQL
      ↓
Analytics APIs
      ↓
Dashboard