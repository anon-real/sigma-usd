import { i18n as i18nInterface } from 'i18next';
import React from 'react';
import { withTranslation } from 'react-i18next';

interface Props {
    i18n: i18nInterface;
    className?: string;
}

const LanguageSelector = (props: Props) => {
    const { i18n } = props;
    return (
        <select
            className="language-selector"
            value={i18n.language}
            onChange={({ target: { value } }) => i18n.changeLanguage(value)}
        >
            <option value="en">EN</option>
            <option value="cs">CZ</option>
            <option value="pt">PT</option>
            <option value="sk">SK</option>
            <option value="sv">SV</option>
            <option value="de">DE</option>
            <option value="es">ES</option>
        </select>
    );
};

export default withTranslation()(LanguageSelector);
