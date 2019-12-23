import * as admin from "firebase-admin";

export const sendNotificationToTopic = (topic: string, snapshot: FirebaseFirestore.DocumentSnapshot) => {
    // * Get current hour
    // TODO: Change it to local (device) time (available from the contest info)
    const time = new Date()
    const currentHour = time.getHours()

    // * Determine the period name
    const period = (currentHour >= 6 && currentHour <= 10) ? "morning" : (currentHour > 10 && currentHour <= 17) ? "noon" : "night"

    // * Assign notification title based on period
    let title = (period === "morning") ? "Morning's here!" : (period === "noon") ? "Howdy!" : "The moon is lovely tonight!"

    // TODO: Delete this when done changing time to local/device time
    title = "This is exciting!!!"

    // * Just to be safe
    if (snapshot.data() === undefined) { console.log("snapshot.data() is undefined"); return }
    if (snapshot.data()['contestOwner'] === undefined) { console.log("snapshot.data()['contestOwner'] is undefined"); return }

    // * Construct the bond of the message
    const message = {
        data: {
            userId: snapshot.data()['contestOwner']
        },
        notification: {
            title: title,
            body: "Hey there's a new outfit! Come VOTE 😃",
        },
        topic: topic
    };

    // * Send message and log to firebase
    admin.messaging().send(message).then((response: any) => {
        console.log('Successfully sent message:', response);
    }).catch((err: any) => {
        console.log('Error sending message:', err);
    })
}