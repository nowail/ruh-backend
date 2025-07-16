FactoryBot.define do
  factory :client do
    sequence(:external_id) { |n| "client_#{n}" }
    sequence(:name) { |n| "Client #{n}" }
    sequence(:email) { |n| "client#{n}@example.com" }
    sequence(:phone) { |n| "555-01#{n.to_s.rjust(2, '0')}" }
    active { true }
    notes { nil }
    
    trait :inactive do
      active { false }
    end
    
    trait :with_notes do
      notes { "Some notes about this client" }
    end
  end
end 