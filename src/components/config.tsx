import { Button, Input, Select, Tabs } from '@supabase/ui';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { isValid, Match, MatchRequest } from '../match/types';
import styles from '../styles/Home.module.css';
import { slugify } from '../utils/utils';

const MatchesConfigComponent = ({
  showConfig,
  showChatId,
  showSaveConfig,
  matches,
  setMatches,
  matchRequest,
  setMatchRequest,
}: {
  showConfig: boolean;
  showChatId: boolean;
  showSaveConfig: boolean;
  matches: Match[];
  setMatches: Dispatch<SetStateAction<Match[]>>;
  matchRequest: MatchRequest;
  setMatchRequest: Dispatch<SetStateAction<MatchRequest>>;
}) => {
  const [error, setError] = useState('');

  const [chatId, setChatId] = useState('');
  const [columnsSendToChat, setColumnsSendToChat] = useState('');

  const [propsToBeEqual, setPropsToBeEqual] = useState('');
  const [propsToBeGreater, setPropsToBeGreater] = useState('');
  // TODO: Consider mark columns in spreadhseet, so they are ignored (color/note etc). So all setup could be made there.
  const [propsToIgnore, setPropsToIgnore] = useState('contact,phone,telegram,facebook');
  const [propsToHaveCommonWords, setPropsToHaveCommonWords] = useState('');
  const [propsToFilter, setPropsToFilter] = useState('');
  const [valuesToFilter, setValuesToFilter] = useState('');

  const [slugInput, setSlugInput] = useState('');
  const [slug, setSlug] = useState('');
  useEffect(() => setSlug(slugify(slugInput)), [slugInput]);

  const [matchType, setMatchType] = useState('generic');
  const [requestSpreadsheetId, setRequestSpreadsheetId] = useState('');
  const [requestSheetId, setRequestSheetId] = useState('');
  const [proposalSpreadsheetId, setProposalSpreadsheetId] = useState('');
  const [proposalSheetId, setProposalSheetId] = useState('');
  //   const [matchRequest, setMatchRequest] = useState<MatchRequest>({
  //     requestSpreadsheetId,
  //     requestSheetId,
  //     proposalSpreadsheetId,
  //     proposalSheetId,
  //     propsToBeEqual,
  //     propsToBeGreater,
  //     propsToIgnore,
  //     propsToHaveCommonWords,
  //     propsToFilter,
  //     valuesToFilter,
  //     chatId,
  //     columnsSendToChat,
  //   });
  useEffect(() => {
    setMatchRequest({
      requestSpreadsheetId,
      requestSheetId,
      proposalSpreadsheetId,
      proposalSheetId,
      slug,
      matchType,
      propsToBeEqual,
      propsToBeGreater,
      propsToIgnore,
      propsToHaveCommonWords,
      propsToFilter,
      valuesToFilter,
      chatId,
      columnsSendToChat,
    });
  }, [
    requestSpreadsheetId,
    requestSheetId,
    proposalSpreadsheetId,
    proposalSheetId,
    slug,
    matchType,
    propsToBeEqual,
    propsToBeGreater,
    propsToIgnore,
    propsToHaveCommonWords,
    propsToFilter,
    valuesToFilter,
    chatId,
    columnsSendToChat,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchMacthes = async () => {
    if (!isValid(matchRequest)) return;

    try {
      setError('');
      setIsLoading(true);
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify(matchRequest),
      });
      const json = await response.json();
      setMatches(json.matches);
      setIsLoading(false);
    } catch (error) {
      setError('Please, check spreadhseet id and name.');
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchMacthes();
  }, []);

  const saveMatchRequest = async () => {
    if (!isValid(matchRequest)) return;
    if (!slug.includes('-')) {
      setError('Please, use 2 words for slug to make it more unique');
    }

    try {
      setError('');
      setIsLoading(true);
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ ...matchRequest }),
      });
      setIsLoading(false);
      if (!response.ok) setError('Please, ask administrator to get access.');
      //router.push(`/${matchRequest.slug}`);
    } catch (error) {
      console.log({ error });
      setError('Please, check spreadhseet id and name.');
      setIsLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'spreadsheets' | 'config' | 'save'>('spreadsheets');

  const TabSpreadsheet = (
    <Tabs.Panel id="spreadsheets" label="Spreadsheets" key="spreadsheets">
      <Input
        beforeLabel="* "
        label="Requests spreadsheet id"
        required
        className="w-full text-md text-center items-center mb-4 mt-2"
        type="text"
        placeholder="1fgmYoJMn6282jzdfjsHsdsd788UYc_xUITy6hIL6"
        value={requestSpreadsheetId}
        onChange={(e) => setRequestSpreadsheetId(e.target.value)}
      />
      <Input
        beforeLabel="* "
        label="Requests sheet name"
        required
        className="w-full text-md text-center items-center mb-4"
        type="text"
        placeholder="Sheet1"
        value={requestSheetId}
        onChange={(e) => setRequestSheetId(e.target.value)}
      />
      <Input
        beforeLabel="* "
        label="Proposals spreadsheet id"
        required
        className="w-full text-md text-center items-center mb-4"
        type="text"
        placeholder="1fgmYoJMn6282jzdfjsHsdsd788UYc_xUITy6hIL6"
        value={proposalSpreadsheetId}
        onChange={(e) => setProposalSpreadsheetId(e.target.value)}
      />
      <Input
        beforeLabel="* "
        label="Proposals sheet name"
        required
        className="w-full text-md text-center items-center mb-4"
        type="text"
        placeholder="Sheet1"
        value={proposalSheetId}
        onChange={(e) => setProposalSheetId(e.target.value)}
      />
    </Tabs.Panel>
  );

  const TabConfig = (
    <Tabs.Panel id="config" label="Config" key="config">
      <Input
        label="Columns: should be the same"
        className="w-full text-md text-center items-center mb-4"
        type="text"
        placeholder="from,to"
        value={propsToBeEqual}
        onChange={(e) => setPropsToBeEqual(e.target.value)}
      />
      <Input
        className="w-full text-md text-center items-center mb-4"
        type="text"
        label="Columns: should be >= "
        placeholder="seats"
        value={propsToBeGreater}
        onChange={(e) => setPropsToBeGreater(e.target.value)}
      />
      <Input
        className="w-full text-md text-center items-center mb-4"
        type="text"
        label="Columns: should be ignored"
        placeholder="telegram,phone"
        value={propsToIgnore}
        onChange={(e) => setPropsToIgnore(e.target.value)}
      />
      <Input
        className="w-full text-md text-center items-center mb-4"
        type="text"
        label="Columns: should have common words"
        placeholder="list"
        value={propsToHaveCommonWords}
        onChange={(e) => setPropsToHaveCommonWords(e.target.value)}
      />
      <Input
        className="w-full text-md text-center items-center mb-4"
        type="text"
        label="Columns: filter by"
        placeholder="status"
        value={propsToFilter}
        onChange={(e) => setPropsToFilter(e.target.value)}
      />
      <Input
        className="w-full text-md text-center items-center mb-4"
        type="text"
        label="Values to filter by for columns above"
        placeholder="done"
        value={valuesToFilter}
        onChange={(e) => setValuesToFilter(e.target.value)}
      />
      {showChatId && (
        <>
          <Input
            className="w-full text-md text-center items-center mb-4"
            type="text"
            label="Telegram chat id"
            placeholder="-12347281"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
          />
          <Input
            className="w-full text-md text-center items-center mb-4"
            type="text"
            label="Columns to send to telegram chat id"
            placeholder="priority,route"
            value={columnsSendToChat}
            onChange={(e) => setColumnsSendToChat(e.target.value)}
          />
        </>
      )}
    </Tabs.Panel>
  );
  const TabSave = (
    <Tabs.Panel id="save" label="Save" key="save">
      <div className="flex flex-col justify-center align-middle items-center w-full">
        <Input
          className="w-full text-md text-center items-center mb-4"
          type="text"
          beforeLabel="* "
          label="Slug to save config to"
          placeholder="un-refugee"
          value={slugInput}
          onChange={(e) => setSlugInput(e.target.value)}
        />
        <p className="mb-4">{`${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`}</p>
        <Button
          block
          size="large"
          disabled={isLoading || !isValid(matchRequest) || !slug}
          className="mb-4 text-2xl w-full"
          onClick={saveMatchRequest}
        >
          Save
        </Button>
      </div>
    </Tabs.Panel>
  );

  const tabs = [];
  tabs.push(TabSpreadsheet);
  tabs.push(TabConfig);
  if (showSaveConfig) tabs.push(TabSave);

  return (
    <div className="flex flex-col justify-center items-center w-2/4">
      <div className="w-full mt-4">
        <Tabs block type="cards" activeId={activeTab} onChange={(e: any) => setActiveTab(e)}>
          {tabs}
        </Tabs>
      </div>

      {activeTab !== 'save' && (
        <div className="flex flex-col justify-center align-middle items-center w-full">
          <Select
            className="mb-4 w-full"
            value={matchType}
            onChange={(event) => setMatchType(event.target.value)}
          >
            <Select.Option value="generic">Generic matching</Select.Option>
            <Select.Option value="un-refugee">Refugee for UN matching</Select.Option>
          </Select>
          <Button
            size="large"
            block
            disabled={isLoading || !isValid(matchRequest)}
            className="mb-4 text-2xl w-full"
            onClick={fetchMacthes}
          >
            Find matches
          </Button>
        </div>
      )}
      {error && <p>{error}</p>}
      {isLoading && <p>Loading...</p>}
    </div>
  );
};

export default MatchesConfigComponent;
