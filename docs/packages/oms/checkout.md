# Checkout

## Overview

### Key Components

## Flow Diagram Over Checkout Sequence


```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Geins    
    User->>Frontend: Go to checkout
    Frontend->>Geins: Get checkout for cart
    Geins-->>Geins: Validate Cart
    Geins-->>Frontend: Return checkout
    Frontend-->>User: Succes

```
