var recorder; // globally accessible
var microphone;
var MediaFile;
var AutoClose;
var RecordingTimeout;
function captureMicrophone(callback) {
    //debugger;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(callback).catch(function (error) {
        alert('Unable to access your microphone. Please try again later.');
        //stopRecording();
        console.error(error);
    });
}
function stopRecordingCallback() {
    //debugger;
    var blob = recorder.getBlob();
    var datetime = new Date();
    MediaFile = "";
    MediaFile = new File([blob], datetime.getTime() + '_audio.wav', { type: 'audio/wav' });
    recorder.microphone.stop();
    if (AutoClose == "true") {
        if ($("#hdn_FromLayout").val() == "Dummy") {
            if ($("#hdn_UserType").val() == "Enrollment") {
                setTimeout(function () {
                    Swal.fire({
                        title: 'Registration Success',
                        text: "Thank you. Your registration has been successfully completed.",
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#28a745',
                        confirmButtonText: 'Continue',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            ShowLoader();
                            $("body").hide();
                            location.href = "../Home/Login";
                            return false;
                        }
                    });
                    HideLoader();
                    return false;
                }, 5000);
            } else {
                setTimeout(function () {
                    HideLoader()
                    Swal.fire({
                        title: 'Verification Success',
                        text: "We have successfully verified your authentication, You can now proceed to your netbanking home page.",
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#28a745',
                        confirmButtonText: 'Continue',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            ShowLoader();
                            $("body").hide();
                            $("#SecRecord").hide();
                            $("#SecErrorMsg").hide();
                            location.href = "../Home/Success";
                            return false;
                        }
                    });
                    return false;
                }, 5000);
            }
        }
        else {
            APICallBack();
        }
    }
}
function startRecording() {
    //debugger;
    RecordingTimeout = setTimeout(function () {
        AutoClose = "true";
        ShowLoader();
        stopRecording();
    }, 20000);
    $("#btnMicOn").hide();
    $("#btnMicOff").show();
    $(".cdev").circlos();
    captureMicrophone(function (microphone) {
        recorder = RecordRTC(microphone, {
            mimeType: "audio/wav",
            numberOfAudioChannels: 1,
            type: 'audio',
            recorderType: StereoAudioRecorder,
            desiredSampRate: 16000
        });
        recorder.startRecording();
        recorder.microphone = microphone;
    });
    return false;
}
function stopRecording() {
    //debugger;
    clearTimeout(RecordingTimeout);
    $("#btnMicOn").show();
    $("#btnMicOff").hide();
    $("#circlosappend").remove();
    recorder.stopRecording(stopRecordingCallback);
    return false;
}

function ShowLoader() {
    $("#overlay").show();
    $("#Loader").show();
}
function HideLoader() {
    $("#overlay").hide();
    $("#Loader").hide();
}

function APICallBack() {
    var formData = new FormData();
    formData.append('file', MediaFile, MediaFile.name);
    formData.append('Id', $("#hdn_UniqueId").val());
    $.ajax({
        "async": true,
        "crossDomain": true,
      // "url": "https://localhost:44349/Api/Hdfc/VoiceUpload
        //"url": "https://kaizenvoiz.net/CUBAPI/Api/Hdfc/VoiceUpload",
        //"url": "https://localhost:44333/api/Data/UploadVoice",

        "url": "https://kaizenvoiz.net/CanaraBankAPI/api/Hdfc/VoiceUpload",

        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": formData,
        success: function (response) {
            response = response.replace(/\"/g, '');
            var lblMsg = "", srctxt = "../images/cross.png";
            var FromLayOut = $("#hdn_FromLayout").val();
            if (response != null) {
                if (response == "Success") {
                    HideLoader();
                    Swal.fire({
                        title: 'Registration Success',
                        text: "Thank you. Your registration has been successfully completed.",
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#28a745',
                        confirmButtonText: 'Continue',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            ShowLoader();
                            $("body").hide();
                            location.href = "../Home/Login";
                            return false;
                        }
                    });
                }
                else if (response == "not sufficient voice data") {
                    HideLoader();
                    Swal.fire({
                        //title: 'Registration or Verification Failed',
                        text: "Your speech length is not sufficient. Please try again.",
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#28a745',
                        confirmButtonText: 'Continue',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            ShowLoader();
                            $("body").hide();
                            location.href = "../Home/Login";
                            return false;
                        }
                    });
                }
                else if (response == "FAILED") {
                    HideLoader();
                    Swal.fire({
                        title: 'Registration Failed',
                        text: "Sorry. Your enrollment is failed. Please try again.",
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#28a745',
                        confirmButtonText: 'Continue',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            ShowLoader();
                            $("body").hide();
                            location.href = "../Home/Login";
                            return false;
                        }
                    });
                }
                else if (response == "Accepted") {
                    HideLoader();
                    Swal.fire({
                        title: 'Verification Success',
                        //text: "Thank you for authenticating yourself. Your proof of life voice certificate is now verified.",
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#28a745',
                        confirmButtonText: 'Continue',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            ShowLoader();
                            $("body").hide();
                            location.href = "../Home/Success";
                            return false;
                        }
                    });
                }
                else if (response == "Rejected") {
                    HideLoader();
                    Swal.fire({
                        title: 'Verification Failed',
                        text: "Sorry. Your authentication is failed. Please try again.",
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#28a745',
                        confirmButtonText: 'Continue',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            ShowLoader();
                            $("body").hide();
                            location.href = "../Home/Login";
                            return false;
                        }
                    });
                }
                else {
                    HideLoader();
                    Swal.fire({
                        //title: 'Registration or Verification Failed',
                        text: "Sorry. Something went wrong. Please try again.",
                        icon: 'error',
                        showCancelButton: false,
                        confirmButtonColor: '#28a745',
                        confirmButtonText: 'Continue',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            ShowLoader();
                            $("body").hide();
                            location.href = "../Home/Login";
                            return false;
                        }
                    });
                }
            }
            else {
                HideLoader();
                Swal.fire({
                    //title: 'Registration or Verification Failed',
                    text: "Sorry. Something went wrong. Please try again.",
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#28a745',
                    confirmButtonText: 'Continue',
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        ShowLoader();
                        $("body").hide();
                        location.href = "../Home/Login";
                        return false;
                    }
                });
            }
            return false;
        },
        error: function (response) {
            HideLoader();
            Swal.fire({
                text: "Sorry. Something went wrong. Please try again.",
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#28a745',
                confirmButtonText: 'Continue',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    ShowLoader();
                    $("body").hide();
                    location.href = "../Home/Login";
                    return false;
                }
            });
            return false;
        }
    });
}

