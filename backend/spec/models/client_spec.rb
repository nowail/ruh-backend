require 'rails_helper'

RSpec.describe Client, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:external_id) }
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:email) }
    it { should validate_presence_of(:phone) }
    it { should validate_uniqueness_of(:external_id) }
    
    it 'validates email format' do
      client = build(:client, email: 'invalid-email')
      expect(client).not_to be_valid
      expect(client.errors[:email]).to include('is invalid')
    end
  end

  describe 'associations' do
    it { should have_many(:appointments).dependent(:destroy) }
  end

  describe 'scopes' do
    let!(:active_client) { create(:client, active: true) }
    let!(:inactive_client) { create(:client, active: false) }

    describe '.active' do
      it 'returns only active clients' do
        expect(Client.active).to include(active_client)
        expect(Client.active).not_to include(inactive_client)
      end
    end

    describe '.recent' do
      it 'orders by created_at desc' do
        expect(Client.recent.to_a).to eq(Client.order(created_at: :desc).to_a)
      end
    end
  end

  describe '.search' do
    let!(:client1) { create(:client, name: 'John Smith', email: 'john@example.com') }
    let!(:client2) { create(:client, name: 'Jane Doe', email: 'jane@example.com') }
    let!(:client3) { create(:client, name: 'Bob Wilson', phone: '555-0123') }

    it 'searches by name' do
      expect(Client.search('John')).to include(client1)
      expect(Client.search('John')).not_to include(client2, client3)
    end

    it 'searches by email' do
      expect(Client.search('jane@example.com')).to include(client2)
      expect(Client.search('jane@example.com')).not_to include(client1, client3)
    end

    it 'searches by phone' do
      expect(Client.search('555-0123')).to include(client3)
      expect(Client.search('555-0123')).not_to include(client1, client2)
    end
  end

  describe '#appointment_count' do
    let(:client) { create(:client) }
    let!(:appointment1) { create(:appointment, client: client) }
    let!(:appointment2) { create(:appointment, client: client) }

    it 'returns the number of appointments' do
      expect(client.appointment_count).to eq(2)
    end
  end

  describe '#valid_for_external_sync?' do
    it 'returns true for valid client' do
      client = build(:client, external_id: 'test-123', name: 'Test User', email: 'test@example.com')
      expect(client.valid_for_external_sync?).to be true
    end

    it 'returns false for invalid client' do
      client = build(:client, external_id: nil, name: 'Test User', email: 'test@example.com')
      expect(client.valid_for_external_sync?).to be false
    end
  end
end 