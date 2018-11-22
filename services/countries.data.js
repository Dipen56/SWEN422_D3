
const nzTeams = ['Central Pulse', 'Northern Mystics', 'Waikato Bay of Plenty Magic', 'Southern Steel', 'Canterbury Tactix'];
const auTeams = ['New South Wales Swifts', 'Adelaide Thunderbirds', 'Melbourne Vixens', 'West Coast Fever', 'Queensland Firebirds'];

const nzVenues = [
    'Auckland',
    'Invercargill',
    'Christchurch',
    'Porirua',
    'Rotorua',
    'Wellington',
    'Hamilton',
    'Palmerston North',
    'Dunedin',
    'Napier',
    'Tauranga',
    'Taupo',
    'Nelson'
];

const auVenues = [
    'Gold Coast',
    'Melbourne',
    'Adelaide',
    'Brisbane',
    'Sydney',
    'Perth'
];

exports.countries = {
    '0' : 'New Zealand',
    '1' : 'Australia'
}

exports.getCountryIDFromTeam = (team) => {
    for(var stored of nzTeams){
        if(stored == team){
            return '0'; // Return New Zealand
        }
    }
    return '1'; // Team is from Australia
};

exports.getCountryIDFromVenue = (venue) => {
    for(var stored of auVenues){
        if(venue.includes(stored)){
            return '1'; // Team is from Australia
        }
    }
    return '0'; // Team is from New Zealand
};