🎛️ Admin API Reference

1. Get All Tickets (with filters)

# Get all tickets

curl "http://localhost:3000/api/admin/tickets"

# Filter by status

curl "http://localhost:3000/api/admin/tickets?status=open"

# Filter by priority and limit results

curl "http://localhost:3000/api/admin/tickets?priority=high&limit=10"

# Pagination

curl "http://localhost:3000/api/admin/tickets?limit=20&offset=40"

2. Get Specific Ticket Details

# Get ticket with all messages

curl "http://localhost:3000/api/admin/tickets/TICKET-ID-HERE/status"

3. Update Ticket Status

# Change status to "in_progress"

curl -X PATCH "http://localhost:3000/api/admin/tickets/TICKET-ID-HERE/status" \
 -H "Content-Type: application/json" \
 -d '{"status": "in_progress"}'

# Change to resolved with admin note

curl -X PATCH "http://localhost:3000/api/admin/tickets/TICKET-ID-HERE/status" \
 -H "Content-Type: application/json" \
 -d '{"status": "resolved", "adminNote": "Issue fixed by updating user settings"}'

# Close ticket

curl -X PATCH "http://localhost:3000/api/admin/tickets/TICKET-ID-HERE/status" \
 -H "Content-Type: application/json" \
 -d '{"status": "closed"}'

4. Reply to Tickets as Admin

# Send reply to user (user gets email notification)

curl -X POST "http://localhost:3000/api/admin/tickets/TICKET-ID-HERE/reply" \
 -H "Content-Type: application/json" \
 -d '{"message": "Thanks for your question! I can help with that..."}'

# Internal admin note (user doesn't see this)

curl -X POST "http://localhost:3000/api/admin/tickets/TICKET-ID-HERE/reply" \
 -H "Content-Type: application/json" \
 -d '{"message": "Need to investigate this further", "isInternal": true}'
