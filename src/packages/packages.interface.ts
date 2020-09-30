import {Readable} from 'stream';

export interface CreatePackageInput {

    /**
     * Email address of a registered user.
     */
    Initiator: string;

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
    PackageName: string;

    /**
     * REST API URL that will be called each time an action has been completed for this package, if
     * no URL is supplied no call back is performed. See section 5.1.11 Package Callback Details
     * below.
     */
    CallBackUrl?: string;

    /**
     * Id that indicates which packages are correlated.
     *
     * The CorrelationId can be used in a GET call to retrieve the Audit proof file
     * (a signed .xml file) about all correlated packages.
     *
     * See section 7. Audit proofs for more information about the audit proofs and the corresponding
     * calls.
     *
     * Important: the Audit proofs setting must be enabled in the Configuration Index to use this
     * parameter. If it is disabled, entering the CorrelationId will return an error.
     */
    CorrelationId?: string;

    /**
     * The ‘Code’ which identifies a document group in which the package should be shown. Default is
     * “00001” to signify “My Documents”. See section 6.1: Get DocumentGroups.
     */
    DocumentGroupCode?: string;

    /**
     * Theme that must be applied to the package.
     */
    ThemeCode?: string;

    /**
     * This parameter determines whether packages can be downloaded from the WYSIWYS before
     * approving/signing.
     * Enter ‘true’ if you want actors to be able to download the package before approving/signing.
     * This way they can print it and read it on paper for instance. Enter ‘false’ to hide the
     * download icon and prevent actors to be able to download packages from the WYSIWYS. When no
     * value is entered, this parameter takes it value from the Config Index setting
     * IsDownloadUnsignedFilesEnabled under Customization Settings.
     */
    DownloadUnsignedFiles?: boolean;

    /**
     * This parameter determines whether packages can be reassigned from the WYSIWYS to another
     * approver/signer. Enter ‘true’ if you want actors to be able to reassign the package.
     *
     * Enter ‘false’ to hide the reassign button and prevent actors to be able to reassign packages
     * from the WYSIWYS.
     *
     * When no value is entered, this parameter takes it value from the Config Index setting
     * IsReassignEnabled under Customization Settings.
     */
    ReassignEnabled?: boolean;

    /**
     * This parameter determines after how many days the action URLs must expire when they are not
     * used.
     * When no value is entered, this parameter takes its value from the Config Index setting
     * IsActionUrlExpirationEnabled under Customization Settings.
     */
    ActionUrlExpirationPeriodInDays?: number;

    /**
     * The date and time when this package expires and can no longer be signed. Documents in
     * packages all use the value given here.
     *
     * Format is ISO 8601 date-time. E.g. 2018-01-23T12:34:00.000Z
     */
    ExpiryTimestamp?: string | Date;

    /**
     * Reference given by the calling application. This parameter will not be used by the
     * eSignatures Portal.
     */
    ExternalPackageReference?: string;

    /**
     * This field is reserved for future use. It can be used for customer-specific extensions to
     * integrate with third-party services, such as Debit Card signing. It is not part of a standard
     * eSignatures installation and should not be used in calls.
     */
    ExternalPackageData?: string;

    /**
     * URL to which the end user is redirected after all fields have been signed with ‘face to face’
     * signing. This field must be a valid absolute url.
     *
     * Attention: don't confuse the F2FRedirectUrl with the 'regular' RedirectUrl. The
     * F2FRedirectUrl only applies to face to face signing. The RedirectUrl applies to regular
     * signing and is set in the Set Process Information call. See section 5.4 Set Process
     * Information > 5.4.14: Redirect URL Details for more info.
     *
     * Note: during asynchronous signing, the signer has the possibility to close the signing
     * session - by means of a Close button - while the signing continues in the background. The
     * purpose of a redirect url however is to redirect the signer to a new URL after the signing
     * has finished. Therefore, when a F2FRedirectUrl is configured, the Close button will be
     * unavailable, and a message is displayed informing the signers they will be redirected.
     */
    F2FRedirectUrl?: string;

    /**
     * REST API URL that will be called when an end user requests to be notified. If no URL is
     * supplied, no call back is performed. See section 5.1.12 Notification Callback Details.
     */
    NotificationCallBackUrl?: string;
}

export interface CreatePackageResponse {

    /**
     * Date and time when the package was created according to the server. ISO 8601.
     */
    CreationTimestamp: string;

    /**
     * Unique identifier of the package.
     */
    PackageId: string;
}

export interface SigningLocationInputBase {

    /**
     * Text string which identifies this location for later use. Must be unique for the document.
     */
    Label: string;
}

export interface SigningLocationByCoordinatesInput extends SigningLocationInputBase {

    /**
     * Number of the page on which to add a signing location. First page is number 1. Zero (0) is
     * not supported. Negative page numbers work as described in section 10.1.
     */
    PageNumber: number;

    /**
     * Width in points (1/72th of an inch). Use the unit utils for conversion.
     */
    Width: string;

    /**
     * Height in points (1/72th of an inch). Use the unit utils for conversion.
     */
    Height: string;

    /**
     * Distance from the left of the page in points (1/72th of an inch). Use the unit utils for
     * conversion.
     */
    Left: string;

    /**
     * Distance from the top of the page in points (1/72th of an inch). Use the unit utils for
     * conversion.
     */
    Top: string;
}

export interface SigningLocationByIdInput extends SigningLocationInputBase {

    /**
     * Unique reference to a signing field, text marker or textfield. See section 10.2 for more
     * details.
     */
    MarkerOrFieldId: string;
}

export interface AddDocumentInput {

    /**
     * Language to use in signature texts.
     * Currently supported: en, nl, de, fr, es.
     *
     * This is also the language that will be used for legal notices when LegalNoticeCode is filled
     * for an Actor.
     */
    DocumentLanguage: 'de' | 'en' | 'es' | 'fr' | 'nl';

    /**
     * Name of the document to be shown in the eSignatures Portal.
     *
     * Note: do not add an extension to the DocumentName value.
     *
     * Important: Pay attention when choosing a document name. Don’t use forbidden file name
     * characters such as slash (/), backslash (), question mark (?), percent (%), asterisk (*),
     * colon (:), pipe (), quote (‘), double quote ("), less than (<), greater than (>). Note
     * however, that is list is not exhaustive. Don’t use characters that are HTML-sensitive such
     * as ampersand (&) or apostrophe (‘). Note: when using itsme signing, only use characters that
     * are supported by ISO 8859-15. This character set supports most usual characters, but some
     * software-generated characters like curly apostrophes and long dashes are not supported.
     */
    DocumentName: string;

    /**
     * Id that indicates which documents within this package are correlated with documents that have
     * been signed in the past in other packages.
     *
     * This CorrelationId can later be used to retrieve all Audit proofs related to this document
     * across many packages. See section 7 for more information.
     *
     * Important: the CorrelationId value must be unique within the same Package.
     * Important: The Audit proofs setting must be enabled in the eSignatures Configuration Index to
     * use this parameter.
     */
    CorrelationId?: string;
}

export type AddDocumentPdfApiInputSigningField =
    | SigningLocationByCoordinatesInput
    | SigningLocationByIdInput

export interface AddDocumentPdfApiInput extends AddDocumentInput {

    /**
     * See section 5.2.7.1.
     */
    SigningFields: Array<AddDocumentPdfApiInputSigningField>;

    /**
     * Type of document that will be signed.
     * Supported values:
     * - application/pdf (default)
     *
     * Word processing and text files are always converted to PDF.
     */
    DocumentType?: 'application/pdf';

    /**
     * Reference given by the calling application. This parameter will not be used by the
     * eSignatures Portal.
     */
    ExternalDocumentReference?: string;

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
     * - Ignore
     *   Ignore means no checks or fixes will be done. Any document will be accepted but this might
     *   later be impossible to sign or result in a PDF with signature validation errors should a
     *   PDF flaw be present. This is the default value if this parameter is not specified and the
     *   eSignatures configuration has no different value.
     * - DetectWarn
     *   When there is an issue, it will be detected and a warning is added to the eSignatures log
     *   file. The upload will still proceed. The upload will still proceed.
     * - DetectFail
     *   When there is an issue, an error is added to the response and the upload is stopped.
     * - DetectFixWarn
     *   When there is an issue, the system will detect and try to fix it. When it’s not possible to
     *   fix it, a warning is added to the eSignatures log but the upload will still proceed.
     * - DetectFixFail
     *   When there is an issue, the system will detect and try to fix it. When it’s not possible to
     *   fix the document, an error is added to the response and the upload is blocked.
     *
     * Note: these actions – ‘Ignore’ excluded – influence the speed of the system in different
     * ways. See appendix II of the eSignatures Configuration Guide for an overview of the steps a
     * document goes through when the other options are selected.
     */
    PdfErrorHandling?:
        | 'DetectFail'
        | 'DetectFixFail'
        | 'DetectFixWarn'
        | 'DetectWarn'
        | 'Ignore'
    ;

    /**
     * The TargetType defines if an extra conversion to PDF/A needs to be done before signing.
     * Values:
     * - Pdf
     * - PdfA1A
     * - PdfA2A
     *
     * Notes:
     * This will only work if the Document Conversion settings have been enabled in the
     * Configuration Index. Existing signatures will be removed unless the PDF is of the specified
     * type. When using itsme as signing method, it is mandatory to use PdfA1A or PdfA2A as
     * TargetType. Note however that Connective does not perform any checks whether this TargetType
     * has been selected.
     */
    TargetType?: string;
}

export type Document = Buffer | Readable | string;

export interface AddDocumentPdfInput {

    /**
     * The ID of the package.
     */
    packageId: string;

    /**
     * PDF document.
     */
    document: Document;

    input: AddDocumentPdfApiInput;
}

export interface AddDocumentXmlApiInput extends AddDocumentInput {

    /**
     * See section 5.2.7.1.
     */
    SigningFields: Array<SigningLocationInputBase>;
}

export interface AddDocumentXmlInput {

    /**
     * The ID of the package.
     */
    packageId: string;

    /**
     * XML document.
     */
    document: Document;

    input: AddDocumentXmlApiInput;

    /**
     * Attached representation document.
     */
    representation?: Buffer;
}

export interface SignatureLocation {

    /**
     * Unique ID for this signing location.
     */
    Id: string;

    /**
     * Detected or specified label.
     */
    Label: string;

    /**
     * The page on which the location was found. Numbering starts with 1 and the highest possible
     * index is equal to the number of pages in the document.
     */
    PageNumber: number;
}

export interface AddDocumentResponse {

    /**
     * Unique id for the document.
     */
    DocumentId: string;

    /**
     * Date and time the flow was created. ISO 8601.
     */
    CreationTimestamp: string;

    /**
     * Array of signing locations.
     */
    Locations: Array<SignatureLocation>;
}

export interface ActorLocationInput {

    /**
     * The id of the location where a signature must be placed by this person.
     */
    Id: string;

    /**
     * LEGALNOTICE1
     * LEGALNOTICE2
     * LEGALNOTICE3
     *
     * The 3 values will point to the 3 legal notices built into the application. These can be
     * altered in the Configuration Index.
     * Forbidden for XML signing.
     */
    LegalNoticeCode?: string;

    /**
     * Custom legal notice text in case none of the three predefined legal notices apply. The text
     * should be written in the same language as the one used in the documents of the package.
     * Forbidden for XML signing.
     */
    LegalNoticeText?: string;
}

export interface ActorSigningTypeMandatedNameAndBirthDate {

    /**
     * Type of validation to execute during eID or other smart card signing session. See
     * section 5.4.12.
     */
    MandatedSignerValidation: 'NameAndBirthDate';

    /**
     * This parameter determines how accurately the actor’s FirstName and LastName must match the
     * data retrieved from the signing certificate or signing service.
     *
     * Important: do not add the percentage sign to the value. A value between 90 and 95 usually
     * produces good results.
     *
     * See section 5.4.12 Mandated Signer Validation for more information.
     */
    MatchLevel: number;
}

export interface ActorSigningTypedMandatedMatchId {

    /**
     * Type of validation to execute during eID or other smart card signing session. See
     * section 5.4.12.
     */
    MandatedSignerValidation: 'MatchId';

    /**
     * Defines which eID or other smart cards are allowed to sign during this session. See
     * section 5.4.12.
     */
    MandatedSignerIds: Array<string>;
}

export interface ActorSigningTypedMandatedDisabled {

    /**
     * Type of validation to execute during eID or other smart card signing session. See
     * section 5.4.12.
     */
    MandatedSignerValidation: 'Disabled';
}

export type SigningType =
    | 'Manual'
    | 'BeId'
    | 'ManualBeId'
    | 'SmsOtp'
    | 'Server'
    | 'MailOtp'
    | 'Idin'
    | 'BeLawyer'
    | 'Biometric'
    | 'Itsme'
    | string

export interface ActorSigningType {

    /**
     * Manual
     * The end user needs to “manually” draw a signature using the mouse or stylus.
     *
     * BeId
     * The end user must sign using a Belgian eID.
     * This signing type requires a third-party smart card reader.
     * Note: in the previous version of the documentation the "BeId" signing type was called
     * "Digital".
     *
     * ManualBeId
     * The end user will sign using a Belgian eID but before doing so draw their signature using the
     * mouse or stylus.
     *
     * Note: in the previous version of the documentation the “ManualBeId” signing type was called
     * “ManualDigital”.
     *
     * SmsOtp
     * A one-time code will be sent to the signer's phone. Depending on the configuration, users may
     * need to complete the last digits of their phone number which was passed in the original
     * request or entered in the Portal's Contact screen. Entering the right code received per sms
     * will initiate the signing.
     *
     * Server
     * The eSignatures solution will sign this field autonomously as soon as the package is set to
     * status ‘Pending’.
     *
     * Note: this signing type can only be used when all locations use the Server signing type,
     * and it cannot be used in combination with choice of signing. It is also restricted to the
     * Instant Package Creation call.
     *
     * MailOtp
     * A one-time code will be sent to the signer's email address. Depending on the configuration,
     * users may need to complete their email address which was passed in the original request or
     * entered in the Portal's Contact screen. Entering the right code received per email will
     * initiate the signing.
     *
     * Idin
     * Signing by means of Dutch bank card through iDIN.
     *
     * BeLawyer
     * The end user must sign using a Belgian lawyer card. This signing type requires a third-party
     * smart card reader.
     *
     * Biometric
     * Signing by means of a biometric signature pad. The drivers of a supported biometric signature
     * pad must be correctly installed on your computer.
     *
     * Itsme
     * Signing via the Belgian Modile ID itsme app.
     * Attention: when using the itsme signing type, the following conditions must be met:
     * The TargetType must be PdfA1A or PdfA2A. See the parameter's description in 5.7.6. Note that
     * this is the user's responsibility. Connective does not check whether this TargetType has been
     * selected in combination with itsme.
     * XML documents cannot be signed with the itsme signing type due to Belgian Mobile ID's terms
     * and conditions. A Signature Policy is required. A default signature policy will be configured
     * by the system admin in the Config Index. This signature policy will be applied if the
     * SignaturePolicyId parameter is left empty. If you want to use a customized signature policy,
     * see Appendix IV of Connective – eSignatures 5.5.x – Configuration Documentation to learn how
     * do so.
     *
     * OpenIdConnect:[Unique Name]
     * As of eSignatures 5.1 you can add a custom signing type through OpenID Connect. To do so,
     * the OpenIDConnect settings must be enabled and correctly configured in the Configuration
     * Index. See Connective – eSignatures 5.5.x – Configuration Documentation.
     *
     * Important: always use the ‘OpenIdConnect:’ prefix, then add the Name that was configured in
     * the Configuration Index in the OpenIdConnect settings group.
     */
    SigningType: SigningType;

    /**
     * One or more OIDs of commitment types. Can only be passed when signature policy is used.
     * See section 5.4.13.
     * Forbidden for XML signing.
     */
    CommitmentTypes?: Array<string>;

    /**
     * This parameter should only be used if you want a different signature policy than the default
     * one set by set by Connective in the Configuration Index.
     *
     * If clients want to use a custom Signature Policy, they need to log a service request at
     * Connective. See section 5.4.13. for more information.
     *
     * Important: if you want to combine legal notices and signature policies, the setting
     * CombineLegalNoticeAndSigningPolicy must be enabled in the Configuration Index.
     */
    SignaturePolicyId?: string;
}

export interface ActorInputWithNotifications {

    /**
     * eSignatures can send e-mails to this entity. Such notifications can be enabled or suppressed
     * by setting this parameter as ‘true’ or ‘false’ (the default is ‘false’).
     */
    SendNotifications?: boolean;
}

export interface ActorInputWithSigning extends ActorInputWithNotifications {

    /**
     * This number specifies in which order the actors need to execute their action.
     *
     * If this number is the same for all approver actors, then the order in which they approve
     * doesn’t matter. Incrementing numbers indicate a sequential flow: the actor with the lowest
     * OrderIndex value must take action first, then the one with the second lowest value and so on.
     * You can also design a complex flow: assign the same OrderIndex value to multiple actors who
     * may approve in parallel and assign a different OrderIndex value to actors who must approve
     * before or after the parallel approval.
     *
     * Important: the OrderIndex applied to approvers must be lower to the one applied to signers.
     *
     * Note: OrderIndex value is also used to sort the different approvers in the Document Details
     * in the WebPortal. Approvers with the lowest OrderIndex value are listed first. If different
     * approvers have the same OrderIndex value, they are listed alphabetically by last name, and
     * then by first name.
     */
    OrderIndex: number;

    /**
     * Url to which the end user is redirected after approving, or rejecting.
     * This field must be a valid absolute url. See section 5.4.14 Redirect Details.
     */
    RedirectURL?: string;
}

export interface ActorApproverInput extends ActorInputWithSigning {

    Type: 'Approver';
}

export type ActorSignerInputSigningType = ActorSigningType & (ActorSigningTypedMandatedDisabled
    | ActorSigningTypedMandatedMatchId
    | ActorSigningTypeMandatedNameAndBirthDate);

export interface ActorSignerInput extends ActorInputWithSigning {

    Type: 'Signer';

    /**
     * The locations where a signature must be placed by this person.
     */
    Locations: Array<ActorLocationInput>;

    SigningTypes: Array<ActorSignerInputSigningType>;

    /**
     * Phone number to receive an SMS OTP.
     *
     * Note: always add the country code in front of the phone number. E.g. +32xxxxxxxxx. It is
     * recommended to use the plus sign as international dialing prefix instead of using "00".
     * Important: never use spaces in the phone number format.
     */
    Phonenumber?: string;

    /**
     * This parameter defines when exactly actors are redirected when using an asynchronous signing
     * method and when a RedirectUrl has been defined.
     *
     * Possible values: AfterSession (default), AfterCompletion, AfterDelay, Immediately.
     *
     * By default, actors are redirected AfterSession. This means they cannot close the signing
     * session and have to wait for all documents to be signed before being redirected.
     *
     * For actors to be redirected immediately, enter Immediately as value.
     *
     * For actors to be redirected after 5 seconds, enter AfterDelay as value.
     *
     * To make sure the final actor is only redirected after the entire package is completed, enter
     * AfterCompletion as value.
     *
     * Note: when AfterCompletion is set for multiple actors, it will only be applied to the final
     * actor. For the other actors, the default AfterSession will be used. Note that this parameter
     * does not apply to F2FRedirectUrl.
     */
    RedirectType?:
        | 'AfterSession'
        | 'AfterCompletion'
        | 'AfterDelay'
        | 'Immediately'
    ;

    /**
     * Information about the signer’s function. This field must match the language used in the
     * documents to be legally valid. Can currently only be passed when signature policy is used,
     * as seen in section 5.4.13.
     * Forbidden for XML signing.
     */
    UserRoles?: Array<string>;

    /**
     * LEGALNOTICE1
     * LEGALNOTICE2
     * LEGALNOTICE3
     *
     * The 3 values will point to the 3 legal notices built into the application. These can be
     * altered in the Configuration Index. The language in which the legal notice is displayed
     * depends on the DocumentLanguage.
     *
     * Note: a LegalNoticeCode or LegalNoticeText set on Location level takes precedence over this
     * value.
     * Forbidden for XML signing.
     */
    LegalNoticeCode?: string;

    /**
     * Custom legal notice text in case none of the three predefined legal notices apply. The text
     * should be written in the same language as the one used in the documents of the package.
     *
     * Note: a LegalNoticeCode or LegalNoticeText set on Location level takes precedence over this
     * value.
     */
    LegalNoticeText?: string;
}

export interface ActorReceiverInput extends ActorInputWithNotifications {

    Type: 'Receiver';
}

export type ActorInput = ActorApproverInput | ActorSignerInput | ActorReceiverInput;

export interface WithActorInput {

    /**
     * Array with more information about what the stakeholder must do.
     */
    Actors: Array<ActorInput>;
}

export interface PersonInput extends WithActorInput {

    EmailAddress: string;

    FirstName: string;

    /**
     * UI language of this person.
     */
    Language:
        | 'da'
        | 'de'
        | 'en'
        | 'es'
        | 'fi'
        | 'fr'
        | 'lv'
        | 'nb'
        | 'nl'
        | 'pl'
        | 'sv'
    ;

    LastName: string;

    /**
     * Date of birth in format: YYYY-MM-DD
     *
     * Note: activating mandated signer validation in the API or configuration might make this
     * required. See section 5.4.12.
     */
    BirthDate?: string;

    /**
     * Phone number to receive an SMS OTP.
     * Use international prefix and no spaces.
     */
    Phonenumber?: string;

    /**
     * Reference given by the calling application. This parameter will not be used by the
     * eSignatures Portal.
     */
    ExternalStakeholderReference?: string;
}

export interface StakeholderPersonInput extends PersonInput {

    Type: 'Person';
}

export interface StakeholderPersonGroupInput extends WithActorInput {

    Type: 'PersonGroup';

    /**
     * Name of the PersonGroup.
     */
    PersonGroupName: string;

    Persons: Array<PersonInput>;
}

export interface StakeholderContactGroupInput extends WithActorInput {

    Type: 'ContactGroup';

    /**
     * Code that was generated when creating a contact group in the eSignatures WebPortal.
     */
    ContactGroupCode: string;
}

export type SetProcessInformationInputStakeholder =
    | StakeholderPersonInput
    | StakeholderPersonGroupInput
    | StakeholderContactGroupInput

export interface SetProcessInformationInput {
    Stakeholders: Array<SetProcessInformationInputStakeholder>;
}

export interface GetSigningLocationsDocument {

    /**
     * Unique id for the document.
     */
    DocumentId: string;

    ExternalDocumentReference: string | null;

    /**
     * Array of signature locations.
     */
    Locations: Array<SignatureLocation>;
}

export interface GetSigningLocationsResponse {
    Documents: Array<GetSigningLocationsDocument>;
}

export interface PackageDocument {

    /**
     * Unique id of the document.
     */
    DocumentId: string;

    /**
     * Returns the external reference of this document as it was passed in through the Add document
     * to package call.
     */
    ExternalDocumentReference: string | null;

    /**
     * Name of the document.
     */
    DocumentName: string;

    /**
     * Type of document within the package.
     */
    DocumentType: 'application/pdf' | 'application/xml';
}

export interface PackageStakeholderActorActionUrl {

    /**
     * Email address of the person.
     */
    EmailAddress: string;

    /**
     * URL that this person can open to interact with the package.
     */
    Url: string;
}

export type ActorStatus =
    | 'Available'
    | 'Draft'
    | 'Failed'
    | 'Finished'
    | 'Inprogress'
    | 'Rejected'
    | 'Skipped'
;

export interface PackageStakeholderActorLocation {

    /**
     * Unique id for this location
     */
    Id: string;

    /**
     * Returns the signing type that was used to sign the document. See section 9 for an overview
     * of the available signing types.
     */
    UsedSigningType: string | null;
}

export interface PackageStakeholderActorBase {

    /**
     * Unique id for this combination of action, stakeholder and document.
     */
    ActorId: string;

    /**
     * URL that this person can open to interact with the package.
     */
    ActionUrl: string | null;

    /**
     * Array of URLs that the different persons of the PersonGroup or ContactGroup can open to
     * interact with the package.
     */
    ActionUrls: Array<PackageStakeholderActorActionUrl> | null;

    /**
     * Draft
     * Inprogress (package is being signed)
     * Available (ready for execution)
     * Finished
     * Rejected (signing cannot continue)
     * Failed
     * Skipped (Initiator skipped the actor)
     */
    ActorStatus: ActorStatus;
}

export interface PackageStakeholderActorApproverAndSigner extends PackageStakeholderActorBase {

    Type: 'Approver' | 'Signer';

    /**
     * The name of the end user who completed the action. This can only be properly filled when an
     * authenticated signing method is used like BeId or Idin.
     */
    CompletedBy: string | null;

    /**
     * Timestamp of the moment on which this action was completed.
     * ISO 8601
     */
    CompletedTimestamp: string | null;

    /**
     * Returns the text entered by the person who changed the status of a package to a final state
     * (e.g. a reject).
     */
    Reason: string | null;

    /**
     * Signature locations.
     */
    Locations: Array<PackageStakeholderActorLocation>;
}

export interface PackageStakeholderActorReceiver extends PackageStakeholderActorBase {

    Type: 'Receiver';
}

export type PackageStakeholderActor =
    | PackageStakeholderActorApproverAndSigner
    | PackageStakeholderActorReceiver
;

export interface PackageStakeholderPersonBase {

    /**
     * External reference identifying this person in the external system.
     *
     * Note: when a package is reassigned, the ExternalStakeholderReference is transferred to the
     * new assignee.
     */
    ExternalStakeholderReference: string | null;

    /**
     * Unique id
     *
     * Note: when a package is reassigned, the StakeholderId is transferred to the new assignee in a
     * standard use case. When using complex signing scenario in which signer 1 is also signer 3, a
     * new StakeholderId will be created for the new assignee who will become signer 1.
     */
    StakeholderId: string;

    Actors: Array<PackageStakeholderActor>;
}

export interface PackageStakeholderPerson extends PackageStakeholderPersonBase {

    Type: 'Person';

    /**
     * Email address of the signer.
     */
    EmailAddress: string;
}

export interface PackageStakeholderPersonGroup extends PackageStakeholderPersonBase {

    Type: 'PersonGroup';

    /**
     * Name of the person group.
     */
    PersonGroupName: string;
}

export interface PackageStakeholderContactGroup extends PackageStakeholderPersonBase {

    Type: 'ContactGroup';

    /**
     * Code of the contact group.
     */
    ContactGroupCode: string;
}

export type PackageStakeholder =
    | PackageStakeholderPerson
    | PackageStakeholderPersonGroup
    | PackageStakeholderContactGroup

export type PackageStatus =
    | 'Draft'
    | 'Expired'
    | 'Failed'
    | 'Finished'
    | 'Pending'
    | 'Rejected'
    | 'Revoked'
;

export interface StatusResponse {

    /**
     * Description for the Package shown to the eSignatures Portal user as file name.
     */
    PackageName: string;

    /**
     * Date and time when the package was created according to the server.
     * ISO 8601.
     */
    CreationTimestamp: string;

    /**
     * Initiator field of the package as it was passed in at creation time.
     */
    Initiator: string;

    /**
     * UTC formatted time at which the document expires.
     */
    ExpiryTimestamp: string | null;

    /**
     * Returns the external reference id of the package as it was passed in at creation time.
     */
    ExternalPackageReference: string | null;

    /**
     * Link to the package which allows to pick from all the signing session at once.
     */
    F2FSigningUrl: string | null;

    /**
     * Status of the package as a whole:
     *
     * Note: a package has the status Failed when a background operation has failed and left a
     * message on the Poison Queue.
     */
    PackageStatus: PackageStatus;

    /**
     * Details for each of the documents in the package.
     */
    PackageDocuments: Array<PackageDocument>;

    /**
     * Details for each of the persons which will interact with the package.
     */
    Stakeholders: Array<PackageStakeholder>;
}

export type SetPackageStatusInput = 'Pending' | 'Revoked';
