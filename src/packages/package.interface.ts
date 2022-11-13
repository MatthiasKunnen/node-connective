import {LegalNotice, LegalNoticeOutput} from '../interfaces/legal-notice.interface';
import {DocumentWarning} from './documents/document-warning.interface';
import {
    AddDocumentParametersInput,
    Document,
} from './documents/document.interface';
import {ElementWithDocumentIndex} from './documents/elements/element.interface';
import {
    CreateStakeholderInputParams,
    Stakeholder,
} from './stakeholders/stakeholder.interface';

export interface CreatePackageWithoutTemplateInput {

    /**
     * Package name, seen in the eSignatures Portal and when downloading as zip file.
     *
     * Note: do not add an extension to the PackageName value.
     *
     * Important: Pay attention when choosing a package name.
     *
     * Don’t use forbidden file name characters such as slash (/), backslash (), question mark (?),
     * percent (%), asterisk (*), colon (:), pipe (), quote (‘), double quote ("), less than (<),
     * greater than (>). Note however, that is list is not exhaustive. Don’t use characters that are
     * HTML-sensitive such as ampersand (&) or apostrophe (‘). Note: when using itsme signing, only
     * use characters that are supported by ISO 8859-15. This character set supports most usual
     * characters, but some software-generated characters like curly apostrophes and long dashes are
     * not supported
     */
    Name: string;

    /**
     * Email address of a registered user.
     */
    Initiator: string;

    /**
     * The status the package will be in when created. The possible values are: draft or pending. By
     * default, a package is in draft after creation.
     */
    Status: 'Draft' | 'Pending';

    /**
     * The documentGroupCode is the identifier of the document group to which the package must be
     * uploaded. In a default configuration, an initiator uploads packages to their personal
     * MyDocuments folder, which cannot be shared with others. To enable collaboration however, an
     * eSignatures admin can configure multiple document groups to which different users may have
     * access. This way, they can collaborate on one another's documents. To upload packages to the
     * MyDocuments folder, do not use this parameter, or specify value 00001. To upload packages to
     *  specific document group, enter its documentGroupCode. Tip: to know which document groups
     *  have been configured in eSignatures, use the Get document groups call.
     */
    DocumentGroupCode?: string;

    /**
     * Date and time when this package expires and can no longer be form filled/approved/signed.
     * Documents within the package expire on the same date.
     *
     * Format is ISO 8601 date-time. E.g. 2018-01-23T12:34:00.000Z
     */
    ExpiryTimestamp?: string | Date;

    /**
     * Documents in base64 encoded format that must be added to the package. The request parameters
     * regarding documents are identical to those of the Add document call and are described
     * [here](https://connectivecommunities.force.com/s/article/API-v4-Add-document-to-package).
     */
    Documents?: Array<AddDocumentParametersInput>;

    /**
     * Stakeholders that must be added to the package. A stakeholder is an object that provides
     * information about any person who is involved with the package.
     */
    Stakeholders?: Array<CreateStakeholderInputParams<ElementWithDocumentIndex>>;

    /**
     * The default legal notice that will be added to a signer when no legal notice is specified.
     */
    DefaultLegalNotice?: LegalNotice | null;

    /**
     * Defines which themeCode must be applied to the package. An eSignatures admin can rebrand the
     * look and feel of the eSignatures WebPortal by creating and configuring new themes. Each theme
     * has a themeCode to identify it. When this parameter is not used, the theme that has been
     * configured on environment level in the Configuration Index, or on document group level if
     * applicable will be applied.
     */
    ThemeCode?: string;

    /**
     * The Callback URL is used to contact external systems. When certain status changes happen,
     * the given URL will be used to send an HTTP POST request, informing the external system that
     * a change has taken place.
     */
    CallBackUrl?: string;

    /**
     * URL that will be called each time the signer requests a new signing URL. Since eSignatures by
     * default uses one-time URLs, the link to sign a package only works once. As soon at is has
     * been clicked, the link expires and a new signing link must be requested.
     */
    NotificationCallBackUrl?: string;

    /**
     * Default URL to which stakeholders will be redirected after completing their actions. Set on
     * package submit, when actor has no RedirectUrl. New since eSignatures 7.0.
     */
    DefaultRedirectUrl?: string;

    /**
     * URL to which the end user is redirected after all fields have been signed or rejected face to
     * face in the Document Portal. See the F2fRedirectUrl Details section below for more
     * information.
     *
     * Attention: Don't confuse the f2fRedirectUrl with the regular RedirectUrl. The f2fRedirectUrl
     * only applies when signing face to face in the Document Portal. The redirect occurs after
     * signing or rejecting. This field must be a valid absolute url.
     *
     * Note: during asynchronous signing, the signer has the possibility to close the signing
     * session - by means of a Close button - while the signing continues in the background. The
     * purpose of a RedirectUrl however is to redirect the signer to a new url after the signing has
     * finished. Therefore, when a F2FRedirectUrl is configured, the Close button will be
     * unavailable, and a message is displayed informing the signers they will be redirected.
     */
    F2fRedirectUrl?: string;

    /**
     * Determines whether an actor can download the package from the WYSIWYS page (What You See Is
     * What You Sign), before form filling, approving, signing or rejecting. Enter ‘true’ if you
     * want actors to be able to download the package before form filling/approving/signing. This
     * way they can print it and read it on paper for instance. Enter ‘false’ to hide the download
     * icon and prevent actors to be able to download packages from the WYSIWYS. When this parameter
     * is not used, the value from the Config Index setting `IsDownloadUnsignedFilesEnabled` under
     * Customization Settings is used.
     */
    IsUnsignedContentDownloadable?: boolean;

    /**
     * Determines whether a stakeholder may reassign their action to another party. Enter ‘true’ if
     * you want actors to be able to reassign the package. Enter ‘false’ to hide the reassign button
     * and prevent actors to be able to reassign packages from the WYSIWYS. When no value is
     * entered, this parameter takes it value from the Config Index setting `IsReassignEnabled`
     * under Customization Settings.
     */
    IsReassignEnabled?: boolean;

    /**
     * External reference to this resource given by a calling application. This parameter is not
     * used by eSignatures itself. Maximum length: 256 characters.
     */
    ExternalReference?: string;

    /**
     * This parameter determines after how many days the action URLs must expire when they are not
     * used. When no value is entered, this parameter takes its value from the Config Index setting
     * `IsActionUrlExpirationEnabled` under Customization Settings.
     */
    ActionUrlExpirationPeriodInDays?: number;

    /**
     * Identifier to correlate this package to other resources in the proofs system.
     */
    ProofCorrelationId?: string;

    /**
     * This parameter is available as of eSignatures 6.5.0. It determines whether the initiator is
     * added by default as receiver of the package. This way, you no longer need to do this manually
     * in a Create actor call.
     *
     * This parameter allows to override the default environment level setting
     * `IsAddInitiatorAsReceiverEnabled` set in the Configuration Index.
     * Note however that when that setting is set to true, it is unnecessary to pass the
     * `AddInitiatorAsReceiver` parameter, since each initiator is then added as receiver by
     * default.
     */
    AddInitiatorAsReceiver?: boolean;

    /**
     * Available as of eSignatures 6.6.0, this parameter enables you to determine whether the
     * package should be archived or not.
     * Note: The value will be ignored if archiving is not configured on an environment level in the
     * Config Index. When archiving is configured, it is unnecessary to pass the `MustBeArchived`
     * parameter, since each package is then archived by default.
     */
    MustBeArchived?: boolean;

    /**
     * Available as of eSignatures 6.6.0, this parameter indicates whether the audit proofs must be
     * archived.
     * Note: The parameter will be ignored if archiving is not configured or if audit proofs are
     * disabled in the audit tools settings or in the archive settings.
     */
    ArchiveAuditProofs?: boolean;

    /**
     * Available as of eSignatures 6.6.0, this parameter indicates whether the audit trail must be
     * archived.
     * Note: The parameter will be ignored if archiving is not configured or if audit trail is
     * disabled in the audit tools settings or in the archive settings.
     */
    ArchiveAuditTrail?: boolean;
}

export type CreatePackageFromTemplateInput = Pick<Partial<CreatePackageWithoutTemplateInput>,
    'Name' | 'ExternalReference' | 'ProofCorrelationId'> & {
    /**
     * Defines which template will be used for the package. When using a template code the package
     * will have all the information from the predefined template already implemented, You can still
     * add or change information using additional api calls.
     * Note: When using a templateCode the only other mandated parameter is the "Initiator", the
     * following are optional: "Name", "ExternalReference" and "ProofCorrelationId" all others will
     * be overwritten by the template itself.
     */
    TemplateCode: string;
};

export type CreatePackageInput = CreatePackageFromTemplateInput | CreatePackageWithoutTemplateInput;

export type PackageStatus =
    | 'Draft'
    | 'Pending'
    | 'InProgress'
    | 'Ending'
    | 'Finished'
    | 'Archived'
    | 'Revoked'
    | 'Expired'
    | 'Failed'
;

export interface Package {

    /**
     * Unique identifier of the package.
     */
    Id: string;

    /**
     * Name of the package. Minimum length: 1 Maximum length: 150
     */
    Name: string;

    /**
     * Status of the package.
     */
    Status: string;

    /**
     * Date and time when the package was created according to the server. Format is ISO 8601
     * date-time. E.g. 2020-01-23T12:34:00:00Z
     */
    CreationDate: string;

    /**
     * Date and time when the package will expire. Format is ISO 8601 date-time.
     * E.g. 2020-01-25T13:00:00:00Z
     */
    ExpiryDate: string | null;

    /**
     * Email address of the user who sent the package. This must be a known user of the WebPortal.
     */
    Initiator: string;

    /**
     * Details of each of the elements that have not been placed or sized in a document. The
     * unplaced element response parameters are the same as the element response parameters listed
     * in the tables below, except that they do not have a location and dimension.
     */
    UnplacedElements: Array<any>;

    /**
     * The documents that were added to the package.
     */
    Documents: Array<Document>;

    /**
     * The stakeholders that were added tp the package.
     */
    Stakeholders: Array<Stakeholder>;

    /**
     * Default legal notice that has been added for the signer(s).
     */
    DefaultLegalNotice: LegalNoticeOutput;

    /**
     * Default URL to which stakeholders will be redirected after completing their actions. Set on
     * package submit, when actor has no RedirectUrl. New since eSignatures 7.0.
     */
    DefaultRedirectUrl: string | null;

    /**
     * External reference to this resource given by a calling application. This parameter is not
     * used by eSignatures itself. Maximum length: 256
     */
    ExternalReference: string | null;

    /**
     * Identifier of the document group to which the package will be added.
     */
    DocumentGroupCode: string;

    /**
     * Identifier of the themeCode that has been applied to this package.
     */
    ThemeCode: string;

    /**
     * Link that will be called upon each status change.
     */
    CallBackUrl: string | null;

    /**
     * URL that will be called each time the signer requests a new signing URL
     */
    NotificationCallBackUrl: string | null;

    /**
     * Link to the package which allows to start a face to face signing session.
     */
    F2fSigningUrl: string | null;

    /**
     * Link to access the preview for a pending package.
     */
    PreviewUrl: string | null;

    /**
     * Link to which the end user is redirected when all fields have been signed, or when a field
     * has been rejected. Attention: not to be confused with a "regular" redirectUrl.
     */
    F2fRedirectUrl: string | null;

    /**
     * Determines whether an actor can download the package from the WYSIWYS page (What You See Is
     * What You Sign), before form filling, approving, signing or rejecting.
     */
    IsUnsignedContentDownloadable: boolean;

    /**
     * This parameter determines after how many days the action URLs must expire when they are not
     * used. When no value is entered, this parameter takes its value from the Config Index setting
     * IsActionUrlExpirationEnabled under Customization Settings.
     */
    ActionUrlExpirationPeriodInDays: number | null;

    /**
     * Identifier to correlate this package to other resources in the proofs system.
     */
    ProofCorrelationId: string | null;

    /**
     * Whether or not the initiator has been added as receiver of this package.
     * Note: This parameter is only returned for draft packages.
     */
    AddInitiatorAsReceiver?: boolean;

    /**
     * Warning about the package, e.g., missing data.
     */
    Warnings: Array<DocumentWarning>;

    /**
     * Whether or not the package will be sent to the external archive when the package status is
     * Finished.
     */
    MustBeArchived: boolean;

    /**
     * Whether the audit proofs will be sent to the external archive when the package status is
     * Finished.
     */
    ArchiveAuditProofs: boolean;

    /**
     * Whether or not the audit trail will be sent to the external archive when the package status
     * is Finished.
     */
    ArchiveAuditTrail: boolean;
}

export interface UpdatePackageStatusInput {

    /**
     * The ID of the package to update the status of.
     */
    PackageId: string;

    /**
     * The new status.
     */
    Status: 'Pending' | 'Revoked';
}
