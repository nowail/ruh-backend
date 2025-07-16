FactoryBot.define do
  factory :appointment do
    association :client
    sequence(:external_id) { |n| "apt_#{n}" }
    start_time { 1.day.from_now.at_beginning_of_hour + 9.hours }
    end_time { 1.day.from_now.at_beginning_of_hour + 10.hours }
    status { 'scheduled' }
    appointment_type { 'Wellness Check' }
    notes { nil }
    
    trait :confirmed do
      status { 'confirmed' }
    end
    
    trait :cancelled do
      status { 'cancelled' }
    end
    
    trait :completed do
      status { 'completed' }
    end
    
    trait :past do
      start_time { 1.day.ago.at_beginning_of_hour + 9.hours }
      end_time { 1.day.ago.at_beginning_of_hour + 10.hours }
    end
    
    trait :today do
      start_time { Time.current.at_beginning_of_hour + 9.hours }
      end_time { Time.current.at_beginning_of_hour + 10.hours }
    end
    
    trait :with_notes do
      notes { "Some notes about this appointment" }
    end
  end
end 