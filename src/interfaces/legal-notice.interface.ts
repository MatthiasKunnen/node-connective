import {NullableObject} from '../utils/types';

export interface LegalNoticeText {
    /**
     * Use the text parameter to use a custom legal notice, i.e. one that is not configured in the
     * Config Index. The legal notice should be written in the same language as the documents of the
     * package. Maximum length: 1000
     */
    Text: string;
}

export interface LegalNoticeName {
    /**
     * The name of the legal notice that will be added to the signing field. To correctly use this
     * parameter, you need to know the name of the different legal notices that are configured in
     * the Config Index. E.g. LEGALNOTICE1. The value of the legal notices is also set in the Config
     * Index. Note that the language in which the legal notice is displayed depends on the language
     * of the document. Maximum length: 20
     */
    Name: string;
}

/**
 * A legal notice is a text the signer must retype before they are able to place their signature.
 * Note that legal notices are case-sensitive*.
 */
export type LegalNotice = LegalNoticeText | LegalNoticeName;
export type LegalNoticeOutput = LegalNotice | NullableObject<LegalNoticeText>;

/**
 * LegalNotice has a response type that is illegal to use as input. This type removes the input
 * property and replaces it with the output property.
 */
export type OverwriteLegalNotice<T extends {LegalNotice?: LegalNotice | null}>
    = Omit<T, 'LegalNotice'> & {
    LegalNotice: LegalNoticeOutput;
};
