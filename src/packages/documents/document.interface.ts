import {
    CreateElementInput,
    CreateElementOutput,
} from './elements/element.interface';

export interface AddDocumentInput {

    /**
     * Unique identifier of the package to which the document will be added.
     */
    PackageId: string;

    Document: AddDocumentParametersInput;
}

export interface AddDocumentParametersInput {
    /**
     * Name of the document. The name is displayed in the eSignatures WebPortal.
     *
     * **Sanitization recommended**: Sanitize the name using the `sanitizeConnectiveName` utility
     * to remove characters that are illegal in filenames and are not supported by
     * ISO 8859-15 (Itmse limitation).
     *
     * Note: do not add an extension to the name value.
     * Minimum length: 1.
     * Maximum length: 150.
     */
    Name: string;

    /**
     * Language that will be used in signature texts and for legal notices when LegalNoticeCode is
     * filled for an Actor. Currently supported: en, nl, de, fr, es, da, nb, sv, fi, lv, pl, hu,
     * it, pt, ro.
     */
    Language: string;

    /**
     * Determines whether the document is optional. Default value is false. When set to true, actors
     * may choose not to form fill/sign the document.
     * @default false
     */
    IsOptional?: boolean;

    /**
     * External reference to this resource given by a calling application. This parameter is not
     * used by eSignatures itself. Maximum length: 256
     */
    ExternalReference?: string;

    /**
     * The elements that will be added to the document. An element is an item that is placed on a
     * document and may be assigned to an actor. For instance, a signing field that can be assigned
     * to a signer actor.
     */
    Elements?: Array<AddElementToDocumentInput>;

    /**
     * Identifier to correlate this document to other resources in the proofs system.
     */
    ProofCorrelationId?: string;

    /**
     * Contains a document's base64 data and media type.
     */
    DocumentOptions: DocumentOptions;

    /**
     * Only applies when DocumentOptions.TargetType is application/xml.
     */
    RepresentationOptions?: RepresentationOptions;
}

export type AddElementToDocumentInput = CreateElementInput;

export interface DocumentOptions {

    /**
     * targetType to which the document will be converted. Possible values are application/pdf and
     * application/xml.
     */
    TargetType?: 'application/pdf' | 'application/xml';

    /**
     * This only applies when application/pdf is set as targetType. It defines optional pdf
     * parameters.
     */
    PdfOptions?: PdfOptions;

    /**
     * base64 data of the document you will be sending. Minimum length: 1 Maximum length: 200000000.
     */
    Base64data: string;

    /**
     * contentType of the document you will be sending. Supported values are:
     * application/pdf, application/xml, application/msword,
     * application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain.
     */
    ContentType:
        | 'application/pdf'
        | 'application/msword'
        | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        | 'application/xml'
        | 'text/plain';
}

export interface PdfOptions {
    /**
     * Defines if an extra conversion to needs to be done before signing. Supported values are: pdf,
     * pdfa1a, pdfa2a. Notes: This parameter will only work if the Document Conversion settings have
     * been enabled in the Configuration Index. Existing signatures will be removed unless the PDF
     * is of the specified type. Important: When using itsme as signing method, it is mandatory to
     * use pdfa1a or pdfa2a as TargetFormat. Note however that Connective does not perform any
     * checks whether this TargetFormat has been selected. Important: Uploading PDF/A documents to
     * which you add form fields using eSignatures API v4 breaks the "/A" part of the PDF. As a
     * result, the documents end up a regular PDF. As a workaround, you can set the TargetFormat
     * parameter in the POST document call to pdfa1a or pdfa2a (depending on the source format). The
     * reaking will still happen but after all form fields have been filled or saved, the document
     * will be converted to the set target format, resulting in a PDF/A document again.
     */
    TargetFormat?: 'pdf' | 'pdfa1a' | 'pdfa2a';

    /**
     * Some PDFs might have minor flaws which prohibit signing. Depending on the request parameters
     * and the configuration settings, PDFs are either only checked or also modified to remove those
     * flaws.
     *
     * Note: The PDF will never be fixed if it already contains signatures, otherwise these
     * signatures would become invalid. The presence of signatures and a PDF flaw might then trigger
     * an error or warning depending on the choices below.
     *
     * The PdfErrorHandling parameter defines the behavior, though the configuration settings might
     * define the behavior if this parameter is not specified. Here are the different actions for
     * the parameter:
     *
     * - Ignore, means no checks or fixes will be done. Any document will be accepted but later it
     *   might be impossible to sign or result in a PDF with signature validation errors should a
     *   PDF flaw be present. This is the default value if the parameter is not specified and if the
     *   eSignatures configuration has no different value.
     * - DetectWarn, when there is an issue, it will be detected and a warning is added to the
     *   eSignatures log file. The upload will still proceed.
     * - DetectFail, when there is an issue, an error is added to the response and the upload is
     *   stopped.
     * - DetectFixWarn, when there is an issue, the system will detect and try to fix it. When it’s
     *   not possible to fix the issue, a warning is added to the eSignatures log and the upload
     *   will still proceed.
     * - DetectFixFail, when there is an issue, the system will detect and try to fix it. When it’s
     *   not possible to fix the issue, an error is added to the response and the upload is blocked.
     *
     * Note: these actions, except for ‘Ignore’, influence the speed of the system in different
     * ways. See appendix II of the eSignatures Configuration Guide for an overview of the steps a
     * document goes through when the other options are selected.
     */
    PdfErrorHandling?:
        | 'Ignore'
        | 'DetectWarn'
        | 'DetectFail'
        | 'DetectFixWarn'
        | 'DetectFixFail';
}

export interface RepresentationOptions {
    /**
     * Base64 data of the document you will be sending. Minimum length: 1 Maximum length: 200000000.
     */
    Base64data: string;

    /**
     * Content type of the document you will be sending.
     */
    ContentType: 'application/pdf';
}

export interface Document {

    /**
     * Unique identifier of the document.
     */
    Id: string;

    /**
     * Unique identifier of the package.
     */
    PackageId: string;

    /**
     * Name of the document, 1-150 characters.
     */
    Name: string;

    /**
     * Date and time when the document was created according to the server. Format is
     * ISO 8601 date-time. E.g. 2020-01-23T12:34:00.000Z
     */
    CreationDate: string;

    /**
     * Whether the document is optional.
     */
    IsOptional: boolean;

    /**
     * MediaType of the document within the package. Possible values: application/pdf or
     * application/xml
     */
    MediaType: 'application/pdf' | 'application/xml';

    /**
     * Language that will be used in signature texts and for legal notices when the LegalNoticeCode
     * is filled for an Actor.
     */
    // Language: string; // Documented but missing

    /**
     * Status of the document within the package. The possible values are draft, pending,
     * inProgress, ending, finished, archived, rejected, revoked, expired, failed.
     */
    Status: string;

    Elements: Array<CreateElementOutput>;

    /**
     * External reference to this resource given by a calling application. This parameter is not
     * used by eSignatures itself. Maximum length: 256
     */
    ExternalReference?: string | null;

    /**
     * New in eSignatures 7.4.0, undocumented, and broken. The first document index is reported as 2
     * and the next as 4 but the actual index is 1 and 3 respectively. When using
     * `documents.getByOrderIndex` either start counting from one increasing in steps of two or
     * subtract one from the `OrderIndex`.
     */
    OrderIndex: number;

    ProofCorrelationId?: string | null;
}

export type DeleteDocumentResponse = '';
