export interface DocumentWarningBase {

    /**
     * The subject of the warning e.g. "process"
     */
    ResourceType: string;

    /**
     * The warning code, follows the format of an eSignatures errorCode.
     */
    Code: string;

    /**
     * A human-readable explanation of the warning.
     */
    Message: string;
}

export interface DocumentWarningProcess extends DocumentWarningBase {

    ResourceType: 'process';

    Stakeholder: {
        Id: string;
        ExternalReference: string;
    };

    Actor: {
        Id: string;
    };
}

export type DocumentWarning = DocumentWarningBase | DocumentWarningProcess
