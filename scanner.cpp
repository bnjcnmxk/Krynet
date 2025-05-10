#include <iostream>
#include <curl/curl.h> // For API calls

const std::string API_KEY = "YOUR_VIRUSTOTAL_API_KEY";
const std::string BASE_URL = "https://www.virustotal.com/vtapi/v2/file/scan";

std::string scan_file(const std::string& file_path) {
    CURL *curl = curl_easy_init();
    if (!curl) {
        return "CURL initialization failed!";
    }

    curl_easy_setopt(curl, CURLOPT_URL, BASE_URL.c_str());
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, "file=@"+file_path);
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, "x-apikey: " + API_KEY);
    
    CURLcode res = curl_easy_perform(curl);
    if (res != CURLE_OK) {
        curl_easy_cleanup(curl);
        return "Error scanning file.";
    }

    curl_easy_cleanup(curl);
    return "Scan complete!";
}

int main() {
    std::string file_path = "path_to_your_file"; // This can be passed via arguments
    std::cout << scan_file(file_path) << std::endl;
    return 0;
}
