#include <iostream>
#include <string>
#include <cstdlib>

void upscale_video(const std::string& video_path, const std::string& gpu_type) {
    std::string command;
    if (gpu_type == "NVIDIA") {
        command = "nvidia_upscale_tool " + video_path;
    } else if (gpu_type == "AMD") {
        command = "amd_upscale_tool " + video_path;
    } else if (gpu_type == "Intel") {
        command = "intel_upscale_tool " + video_path;
    } else {
        std::cerr << "Unsupported GPU type." << std::endl;
        return;
    }

    system(command.c_str());
}

int main() {
    std::string video_path = "path_to_video_file"; // Passed via args
    std::string gpu_type = "NVIDIA"; // Or dynamically detect GPU type
    upscale_video(video_path, gpu_type);
    return 0;
}
