import { availableLanguages } from 'i18n';
import { i18n as i18nInterface } from 'i18next';
import React from 'react';
import { withTranslation } from 'react-i18next';

interface Props {
    i18n: i18nInterface;
    className?: string;
}

const LanguageSelector = (props: Props) => {
    const { i18n, } = props;
    return (
        <select
            className="language-selector"
            value={i18n.language}
            onChange={({ target: { value } }) => i18n.changeLanguage(value)}
        >
            {availableLanguages.map(([code, label]) => (<option key={code} value={code}>{label}</option>))}
        </select>
    );
};

export default withTranslation()(LanguageSelector);
