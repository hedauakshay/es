import elasticsearch from "elasticsearch";
import React, { Component } from 'react';
const axios = require('axios');
const rp = require('request-promise');

export default class ElasticContent {

    handleScroll(search_query, index, type, nextFive) {
        if (search_query) {
            this.getData(search_query, index, type, nextFive);
            //console.log("handleScroll --> " + search_query + " : " + " --> " + index + " --> " + type + " <--"+ nextFive);
        }
    }

    handleChange(search_query, index, type) {

        //console.log("handleChange --> " + search_query + " : " + " --> " + index + " --> " + type + " <--");
        //const search_query = event.target.value;
        if (search_query) {
            this.getData(search_query, index, type, 7);

            // Optionally the request above could also be done as

            /*fetch('http://ec2-52-35-155-69.us-west-2.compute.amazonaws.com/elastic', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Headers": "X-Requested-With",
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstParam: search_query
                })
            }).then(response => response.json())
                .then(responseJson => {
                    console.log(responseJson);
                    const tokenInfo = this.state.token;
                    console.log(tokenInfo);
                }).catch(function () {
                    console.log("Catch");
                });*/

        }



    }

    client = () => {
        return (new elasticsearch.Client({
            host: "https://search-rc-elasticsearch-dev-xmejf62hlwqa7fmuyvti6tb5uu.us-west-2.es.amazonaws.com",
            headers: {
                'Content-Type': 'application/json'
            },
            log: 'trace'
        }))
    }

    setIndex(index) {
        //console.log("setIndex " + index);
        if (index)
            return index;
        else
            return '';
    }

    setType(type) {
        //console.log("setType " + type);
        if (type)
            return type;
        else
            return '';
    }

    queryalldocs(search_query, val) {

        //console.log("queryyyyyyyy ");
        return ({
            "size": val, //default 10,
            "from": 0, //default 0,
            'query': {
                "query_string": {
                    "query": search_query
                }
            }
        })
    }

    async getData(search_query, index, type, val) {

        console.log("getData --> " + search_query + " : " + index + " : " + type + " : ");

        try {

            let promise = new Promise((resolve, reject) => {

                this.client().search({
                    index: 'knowledge',
                    type: this.setType(type),
                    body: this.queryalldocs(search_query, val),
                    filterPath: ['hits.hits._source']
                }).then(function (body) {
                    if (body.hits) {
                        resolve(body.hits.hits);
                    }
                }, function (error) {
                    console.trace(error.message);
                });
            });

            let promiseCount = new Promise((resolve, reject) => {
                this.client().count({
                    index: 'knowledge',
                    type: this.setType(type),
                    body: {
                        'query': {
                            "query_string": {
                                "query": search_query
                            }
                        }
                    }
                }, function (error, response) {
                    console.log(response.count);
                    resolve(response.count);
                });
            });

            let result = await promise;
            let count = await promiseCount;
            let morePageRes = val + 4 < count ? true : false;
            console.log("result " + result);
            console.log(result);
            this.setState({
                results: result,
                term: search_query,
                type: this.setType(type),
                index: this.setIndex(index),
                nextRecords: val + 4,
                resultCount: count,
                morePage: morePageRes
            });
        } catch (e) {
            console.log("Error handled");
        }

    }

}