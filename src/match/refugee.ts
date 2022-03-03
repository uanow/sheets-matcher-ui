import { locationTranslations } from './translations';

export interface Proposal {
  rowNumber: number;
  status: string;
  name: string;
  city: string;
  country: string;
  languages: string;
  contact: string;
  social: string;
  phone: string;
  seats: string;
  when_from: string;
  when_to: string;
  pets: string;
  transfer: string;
  travel_distance: string;
  refugee: string;
  comments: string;
  suggestions: string;
}

export const mapRowToProposal = (row: any): Proposal => ({
  rowNumber: row.rowNumber,
  status: row['Status'],
  name: row['Full name'],
  city: row['City where you can host'],
  country: row['Country where you can host'],
  languages: row['What languages you speak?'],
  contact: row['How to contact you?'],
  social: row['Link to your social media'],
  phone: row['Phone number'],
  seats: row['Number of people you can host?'],
  when_from: row["What's a start date you can host from?"],
  when_to: row['Till what date you can host?'],
  pets: row['Available for pets hosting?'],
  transfer: row['Do you have a car to help with a transfer?'],
  travel_distance: row["How far you're ready to travel to pick people up?"],
  refugee: row['Refugee'],
  comments: row['Comments'],
  suggestions: row['Suggestions'],
});

export interface Request {
  rowNumber: number;
  status: string;
  email: string;
  name: string;
  from: string;
  city: string;
  country: string;
  languages: string;
  contact: string;
  seats: string;
  when_from: string;
  pets: string;
  kids: string;
  host: string;
  comments: string;
  suggestions: string;
}

export const mapRowToRequest = (row: any): Request => ({
  rowNumber: row.rowNumber,
  status: row['статус заявки'],
  email: row['Пошта'],
  name: row["Ім'я"],
  from: row['Ваша теперішня локація'],
  city: row['В яке місто прямуєте?'],
  country: row['В яку країну прямуєте?'],
  languages: row['Якими мовами спілкуєтесь?'],
  contact: row['Контактний номер'],
  seats: row['Скільки людей'],
  when_from: row['Коли виїзд'],
  pets: row['Чи є тварини?'],
  kids: row['Чи є діти?'],
  host: row['Хост'],
  comments: row['Комментар'],
  suggestions: row['Suggestions'],
});

const matchLocation = (request: Request, proposal: Proposal): boolean => {
  if (
    request.city === proposal.city ||
    locationTranslations[proposal.city]?.includes(request.city) ||
    locationTranslations[request.city]?.includes(proposal.city)
  )
    return true;
  if (
    proposal.country === request.country ||
    locationTranslations[proposal.country]?.includes(request.country) ||
    locationTranslations[request.country]?.includes(proposal.country)
  )
    return true;
  return false;
};

const NO_ANSWERS = ['no', 'ні', 'нема', 'немає', ''];
const matchPets = (request: Request, proposal: Proposal): boolean => {
  if (
    request.pets &&
    !NO_ANSWERS.includes(request.pets) &&
    (!proposal.pets || NO_ANSWERS.includes(proposal.pets))
  )
    return false;
  return true;
};

const match = (request: Request, proposal: Proposal): boolean =>
  matchLocation(request, proposal) &&
  matchPets(request, proposal) &&
  +proposal.seats >= +request.seats;

const filterRequests = (request: Request): boolean =>
  !request.host && ['new', 'Delegated to i1'].includes(request.status);
const filterProposals = (proposal: Proposal): boolean =>
  !proposal.refugee && ['new'].includes(proposal.status);

const getRefugeeMatchFuncs = {
  match,
  filterRequests,
  filterProposals,
  mapRowToRequest,
  mapRowToProposal,
};

export default getRefugeeMatchFuncs;
