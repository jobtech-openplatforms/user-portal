export class AssetsManager {
    public static getLogoPath(companyName: String) {
        switch (companyName) {
            case "Freelancer":
                return require("@/assets/images/platform-icons/freelancer.png");
            case "MyGigData":
            case "My Digital Backpack":
                return require("@/assets/images/application-icons/my-digital-backpack.png");
            case "Test app 1":
                return require("@/assets/images/application-icons/my-digital-backpack.png");
            default:
                return "";
                break;

        }
    }
}