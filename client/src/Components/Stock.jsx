import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import axios from 'axios';
import { apiKey } from '../api-keys/apiKey';
import Chart from './StockChart';

const StocksWrapper = styled.div`
    /* border: 1px solid red; */
    display: flex;
    gap: 30px;
    min-height: 50vh;
`;

const StockInformation = styled.div`
    /* border: 3px solid yellow; */
    max-width: 20%;
    padding: 4px 8px;
    display: flex;
    flex-flow: column wrap;
    gap: 15px;
    align-items: flex-start;
`;

const GraphSection = styled.div`
    border: 2px solid green;
    flex: 1;
`;

const SpanStyle = styled.span`
    display: flex;
    flex-flow: column;
`;

function Stock() {
    const { symbol } = useParams();

    const fetchAPIData = async () => {
        const res = await axios.get(
            `https://api.twelvedata.com/quote?symbol=${symbol}&exchange=NYSE&apikey=${apiKey}`,
        );
        return res.data;
    };

    const fetchGraphData = async () => {
        const res = await axios.get(
            `https://api.twelvedata.com/time_series?interval=1day&symbol=${symbol}&dp=3&exchange=NYSE&apikey=${apiKey}`,
        );
        return res.data;
    };

    const stockQueryKey = ['stockIndividual', symbol];
    const graphQueryKey = ['graph', symbol];

    const {
        data: stockIndividualData,
        error: stockIndividualError,
        isLoading: stockIndividualLoading,
    } = useQuery(stockQueryKey, fetchAPIData);

    const {
        data: graphData,
        error: graphError,
        isLoading: graphLoading,
    } = useQuery(graphQueryKey, fetchGraphData);

    const stock = {
        symbol: '020Y',
        name: 'iShares IV Public Limited Company - iShares Euro Government Bond 20yr Target Duration UCITS ETF',
        currency: 'EUR',
        exchange: 'LSE',
        mic_code: 'XLON',
        country: 'United Kingdom',
        type: 'Common Stock',
    };
    if (stockIndividualLoading || graphLoading) {
        return <div>Loading...</div>;
    }

    if (stockIndividualError) {
        console.error('Database Error:', stockIndividualError);
        return <div>Error fetching user data. Please try again later.</div>;
    }

    if (graphError) {
        console.error('API Error', graphError);
        return <div>Error fetching API data. Please try again later.</div>;
    }

    return (
        <>
            <StocksWrapper>
                <StockInformation>
                    <SpanStyle>
                        <span>Name:</span>
                        {stockIndividualData.name}
                    </SpanStyle>
                    <SpanStyle>
                        <span>Symbol:</span>
                        {stockIndividualData.symbol}
                    </SpanStyle>
                    <SpanStyle>
                        <span>Currency: </span>
                        {stockIndividualData.currency}
                    </SpanStyle>
                    <SpanStyle>
                        <span>Exchange: </span>
                        {stockIndividualData.exchange}
                    </SpanStyle>
                    <SpanStyle>
                        <span>Closed at: </span>
                        {stockIndividualData.close}
                    </SpanStyle>
                    <SpanStyle>
                        <span>Percent Change: </span>
                        {stockIndividualData.percent_change}
                    </SpanStyle>
                </StockInformation>

                <GraphSection>
                    <Chart graphData={graphData} />
                </GraphSection>
            </StocksWrapper>
        </>
    );
}

export default Stock;
