import css from './FaqPage.module.scss'

import cn from 'classnames';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import MarkdownView from 'react-showdown';

import Header from 'components/Header/Header';
import { Navigation } from 'components/Navigation/Navigation';
import { Title } from 'components/Title/Title';
import { useParams } from 'react-router-dom';
import Footer from 'components/Footer/Footer';


const questions = [
    'what-is-sigmausd',
    'what-is-ageusd',
    'how-to-buy',
    'reserve-ratio-bounds',
    'sigmausd-vs-oracle',
    'refunds',
    'bearwhale',
];

type UrlParams = {
    slug?: string;
}

export const FaqPage = () => {

    const { slug } = useParams<UrlParams>();

    const { t } = useTranslation(['translation', 'faq']);

    useEffect(() => {
        if (slug) {
            const elem = document.getElementById(slug);
            elem?.scrollIntoView(true);
        }
    }, [slug]);

    return (
        <>
            <Header />
            <main className="main-container">
                <Navigation />
                <Title>
                    <Trans i18nKey="faq" />
                    <Trans i18nKey="faqTag" />
                </Title>
                <ul className={css.list}>
                    {questions.map(q => {
                        return (
                            <li key={q} className={css.entry} id={q}>
                                <div className="card" style={{ width: '100%' }}>
                                    <h3 className={cn('card__title', css.title)} >
                                        <a href={`#/faq/${q}`}>¶</a>&nbsp;
                                        <span><Trans i18nKey={`${q}.q`} ns="faq" /></span>
                                    </h3>
                                    <MarkdownView markdown={t(`faq:${q}.a`)} />
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <Footer />
            </main>
        </>
    );
}


