# Seed default Workspace
workspace = Workspace.find_or_create_by!(name: "Acme Agency")

# Seed users
users_data = [
  { name: "Admin User", email: "admin@agency.com", password: "password123", role: "Admin" },
  { name: "Manager User", email: "manager@agency.com", password: "password123", role: "Manager" },
  { name: "Sales Rep User", email: "sales@agency.com", password: "password123", role: "Sales Rep" },
  { name: "Intern User", email: "intern@agency.com", password: "password123", role: "Intern" }
]

users = {}
users_data.each do |user_attrs|
  user = User.find_or_initialize_by(email: user_attrs[:email])
  user.name = user_attrs[:name]
  user.password = user_attrs[:password]
  user.role = user_attrs[:role]
  user.workspace = workspace
  user.save!
  users[user.role] = user
end

# Clean up old seed records
AuditLog.delete_all
FollowUp.delete_all
Activity.delete_all
Lead.delete_all

# Mock Leads Data
leads_raw = [
  { business_name: "BlueSky Digital", contact_name: "Sarah Jenkins", email: "sarah@blueskydigital.com", phone: "+15550192", website: "blueskydigital.com", industry: "Tech", city: "New York", stage: "New", owner_role: "Sales Rep" },
  { business_name: "Apex Logistics", contact_name: "John Miller", email: "jmiller@apexlogistics.com", phone: "+15550293", website: "apexlogistics.com", industry: "Logistics", city: "Chicago", stage: "Contacted", owner_role: "Sales Rep" },
  { business_name: "Greenfield Retail", contact_name: "Emma Watson", email: "emma@greenfield.com", phone: "+15550384", website: "greenfield.com", industry: "Retail", city: "Austin", stage: "Interested", owner_role: "Sales Rep" },
  { business_name: "Vanguard Tech", contact_name: "David Lee", email: "david.lee@vanguard.com", phone: "+15550475", website: "vanguardtech.com", industry: "Tech", city: "San Francisco", stage: "Meeting Scheduled", owner_role: "Sales Rep" },
  { business_name: "Summit Health", contact_name: "Lisa Brown", email: "lisa@summithealth.com", phone: "+15550566", website: "summithealth.com", industry: "Healthcare", city: "Denver", stage: "Proposal Sent", owner_role: "Sales Rep" },
  { business_name: "Alpha Real Estate", contact_name: "Robert Davis", email: "robert@alphare.com", phone: "+15550657", website: "alphare.com", industry: "Real Estate", city: "Miami", stage: "Negotiation", owner_role: "Manager" },
  { business_name: "Pixel Studios", contact_name: "Clara Oswald", email: "clara@pixelstudios.com", phone: "+15550748", website: "pixelstudios.com", industry: "Creative", city: "Los Angeles", stage: "Won", owner_role: "Sales Rep" },
  { business_name: "Quantum Consulting", contact_name: "Bruce Banner", email: "bruce@quantumconsulting.com", phone: "+15550839", website: "quantumconsulting.com", industry: "Consulting", city: "Boston", stage: "Lost", owner_role: "Intern" },
  { business_name: "Nova Fashion", contact_name: "Stella Ward", email: "stella@novafashion.com", phone: "+15550921", website: "novafashion.com", industry: "Retail", city: "New York", stage: "New", owner_role: "Intern" },
  { business_name: "Ecliptic Foods", contact_name: "George Smith", email: "george@eclipticfoods.com", phone: "+15551012", website: "eclipticfoods.com", industry: "Food", city: "Seattle", stage: "Contacted", owner_role: "Intern" },
  { business_name: "Oracle Law", contact_name: "Harvey Specter", email: "harvey@oraclelaw.com", phone: "+15551123", website: "oraclelaw.com", industry: "Legal", city: "New York", stage: "Interested", owner_role: "Manager" },
  { business_name: "Titan Manufacturing", contact_name: "Peter Parker", email: "peter@titanmfg.com", phone: "+15551234", website: "titanmfg.com", industry: "Manufacturing", city: "Pittsburgh", stage: "Meeting Scheduled", owner_role: "Sales Rep" },
  { business_name: "Atlas Commerce", contact_name: "Diana Prince", email: "diana@atlascommerce.com", phone: "+15551345", website: "atlascommerce.com", industry: "Retail", city: "Washington", stage: "Proposal Sent", owner_role: "Sales Rep" },
  { business_name: "Synergy HR", contact_name: "Tony Stark", email: "tony@synergyhr.com", phone: "+15551456", website: "synergyhr.com", industry: "HR", city: "Los Angeles", stage: "Negotiation", owner_role: "Sales Rep" },
  { business_name: "Horizon Solar", contact_name: "Clark Kent", email: "clark@horizonsolar.com", phone: "+15551567", website: "horizonsolar.com", industry: "Energy", city: "Metropolis", stage: "Won", owner_role: "Manager" },
  { business_name: "Pinnacle Media", contact_name: "Lois Lane", email: "lois@pinnaclemedia.com", phone: "+15551678", website: "pinnaclemedia.com", industry: "Creative", city: "Metropolis", stage: "Lost", owner_role: "Intern" },
  { business_name: "Cyberdyne Systems", contact_name: "Sarah Connor", email: "sconnor@cyberdyne.com", phone: "+15551789", website: "cyberdyne.com", industry: "Tech", city: "Los Angeles", stage: "New", owner_role: nil }, # Unassigned
  { business_name: "Tyrell Corp", contact_name: "Eldon Tyrell", email: "eldon@tyrell.com", phone: "+15551890", website: "tyrell.com", industry: "Tech", city: "Los Angeles", stage: "Contacted", owner_role: nil }, # Unassigned
  { business_name: "Weyland Industries", contact_name: "Peter Weyland", email: "peter@weyland.com", phone: "+15551901", website: "weyland.com", industry: "Tech", city: "Boston", stage: "New", owner_role: "Sales Rep", archived: true } # Archived
]

leads = []
leads_raw.each do |l_attrs|
  owner = l_attrs[:owner_role] ? users[l_attrs[:owner_role]] : nil
  lead = Lead.create!(
    business_name: l_attrs[:business_name],
    contact_name: l_attrs[:contact_name],
    email: l_attrs[:email],
    phone: l_attrs[:phone],
    website: l_attrs[:website],
    industry: l_attrs[:industry],
    city: l_attrs[:city],
    stage: l_attrs[:stage],
    archived: l_attrs[:archived] || false,
    workspace: workspace,
    owner: owner
  )
  leads << lead

  # Create audit log for lead creation
  creator = owner || users["Admin"]
  AuditLog.create!(
    user: creator,
    action: "Lead Created",
    trackable: lead,
    metadata: { business_name: lead.business_name, stage: lead.stage }.to_json
  )
end

# Seed Activities
activities_pool = [
  { activity_type: "Call", notes: "Called the prospect. They are interested in a redesign and requested more information." },
  { activity_type: "Email", notes: "Sent introductory proposal details with our current pricing list." },
  { activity_type: "WhatsApp", notes: "Exchanged quick messages to confirm their availability for a call next week." },
  { activity_type: "Meeting", notes: "Met online for 30 minutes. Reviewed their requirements and agreed to send a customized proposal." },
  { activity_type: "Note", notes: "Spoke at a local business expo. They have a budget of $10k-15k for the project." }
]

leads.each do |lead|
  # Add 1-3 activities for each lead depending on their stage
  num_activities = case lead.stage
  when "New" then 1
  when "Contacted" then 1
  when "Interested" then 2
  when "Meeting Scheduled", "Proposal Sent" then 3
  else 4
  end

  num_activities.times do |i|
    act_data = activities_pool.sample
    user = lead.owner || users["Sales Rep"]
    activity = Activity.create!(
      lead: lead,
      user: user,
      activity_type: act_data[:activity_type],
      notes: act_data[:notes],
      created_at: (i + 1).days.ago
    )

    AuditLog.create!(
      user: user,
      action: "Activity Logged",
      trackable: lead,
      metadata: { type: activity.activity_type }.to_json
    )
  end
end

# Seed Follow Ups
leads.each do |lead|
  # Schedule follow ups for non-won/lost leads
  next if [ "Won", "Lost" ].include?(lead.stage)

  user = lead.owner || users["Sales Rep"]

  # Completed follow-up
  FollowUp.create!(
    lead: lead,
    due_date: 3.days.ago,
    notes: "Follow up call to check if they received our proposal.",
    status: "Completed"
  )

  # Active follow-up
  due = [ 1.day.ago, 1.day.from_now, 3.days.from_now, 5.days.from_now ].sample
  status = due < Time.current ? "Missed" : "Pending"

  FollowUp.create!(
    lead: lead,
    due_date: due,
    notes: "Follow up to schedule the next meeting / check status of negotiations.",
    status: status
  )
end

puts "Seeded default Workspace: Acme Agency"
puts "Seeded users: admin@agency.com, manager@agency.com, sales@agency.com, intern@agency.com"
puts "Seeded #{leads.count} Leads"
puts "Seeded #{Activity.count} Activities"
puts "Seeded #{FollowUp.count} Follow Ups"
puts "Seeded #{AuditLog.count} Audit Logs"
