export interface SigningMethod<Active extends boolean = boolean> {
    /**
     * Whether the SigningMethod can be used to create new signing fields.
     */
    IsActive: Active;

    /**
     * The name of the SigningMethod as configured in the Configuration Index.
     */
    Name: string;

    /**
     * The names of the SigningMethod in the different languages as they will be shown to a signer
     * in WYSIWYS. `{language: name}`.
     */
    DisplayNames: Record<string, string>;

    /**
     * The names of the SigningMethod in the different languages as they will be shown to an
     * initiator in the WebPortal. `{language: name}`.
     */
    DisplayNamesInitiator: Record<string, string>;

    /**
     * The descriptions of the SigningMethod in the different languages as they will be shown to an
     * initiator in the WebPortal. `{language: name}`.
     */
    Descriptions: Record<string, string> | null;

    /**
     * The properties that are required to be passed in the Create stakeholders call. When
     * RequiredProperties are returned for a SigningMethod, it means mandated signing rules have
     * been applied to that SigningMethod. To check whether a signer is mandated to sign during a
     * particular signing session, eSignatures compares the data passed in the RequiredProperties to
     * the external data retrieved from the signing certificate or returned by the signing service.
     */
    RequiredProperties: Array<string>;
}
