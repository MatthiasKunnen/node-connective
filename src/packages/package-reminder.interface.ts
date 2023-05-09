import {ExclusiveUnion} from '../utils/types';

export interface PackageAutomaticReminder {
    IsSendAutomaticRemindersEnabled: boolean;
    DaysBeforeFirstReminder: number;
    IsRepeatRemindersEnabled: boolean;
    RepeatReminders: number;
}

interface DisabledAutomaticReminders {
    IsSendAutomaticRemindersEnabled?: false;
}

interface EnabledAutomaticReminders {

    /**
     * When true, requires `DaysBeforeFirstReminder`.
     */
    IsSendAutomaticRemindersEnabled: true;

    /**
     * Requires `IsSendAutomaticRemindersEnabled`.
     */
    DaysBeforeFirstReminder: number;
}

interface DisabledRepeatReminders {
    IsRepeatRemindersEnabled?: false;
}

interface EnabledRepeatReminders {
    /**
     * Requires `IsSendAutomaticRemindersEnabled: true` and `DaysBeforeFirstReminder` configured.
     */
    IsRepeatRemindersEnabled: true;
    /**
     * Amount of repetitions.
     */
    RepeatReminders: number;
}

export type PackageAutomaticReminderInput = ExclusiveUnion<
    | DisabledAutomaticReminders
    | EnabledAutomaticReminders & (
        | DisabledRepeatReminders
        | EnabledRepeatReminders
    )
>;

export type PackageExpirationReminderInput = ExclusiveUnion<{
    IsSendExpirationRemindersEnabled?: false;
} | {
    IsSendExpirationRemindersEnabled: true;
    DaysBeforeExpirationReminder: number;
}>;

export interface PackageExpirationReminder {
    IsSendExpirationRemindersEnabled: boolean;
    DaysBeforeExpirationReminder: number;
}
