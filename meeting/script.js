const form = document.getElementById("meeting-form");
const roomNameInput = document.getElementById("room-name");
const jitsiContainer = document.getElementById("jitsi-container");

// Create Leave Meeting button
const leaveBtn = document.createElement("button");
leaveBtn.id = "leave-meeting";
leaveBtn.textContent = "Leave Meeting";
leaveBtn.style.display = "none";
document.querySelector(".meeting-area").appendChild(leaveBtn);

let jitsiApi = null;

// Friendly auto-room name generator
const getRandomRoomName = () => {
  const adjectives = ["happy", "brave", "curious", "sunny", "gentle"];
  const animals = ["pandas", "dolphins", "stars", "bunnies", "penguins"];
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  return `connect-${randomAdjective}-${randomAnimal}-${Date.now()}`;
};

// Fun sounds
const joinSound = new Audio("join.mp3");  // Add your join sound file
const leaveSound = new Audio("leave.mp3");  // Add your leave sound file

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const roomName = roomNameInput.value.trim() || getRandomRoomName();

  if (jitsiApi) {
    jitsiApi.dispose();
    jitsiApi = null;
  }

  // Clear and animate container
  jitsiContainer.innerHTML = "";
  jitsiContainer.classList.add("fade-in");

  const domain = "meet.jit.si";
  const options = {
    roomName: roomName,
    width: "100%",
    height: 500,
    parentNode: jitsiContainer,
    interfaceConfigOverwrite: {
      DEFAULT_REMOTE_DISPLAY_NAME: "Participant",
    },
    configOverwrite: {
      prejoinPageEnabled: false,
      startWithAudioMuted: false,
      startWithVideoMuted: false,
      disableModeratorIndicator: true,
      enableWelcomePage: false,
    },
  };

  jitsiApi = new JitsiMeetExternalAPI(domain, options);

  leaveBtn.style.display = "inline-block";
  joinSound.play().catch(() => {});
});

leaveBtn.addEventListener("click", () => {
  if (jitsiApi) {
    jitsiApi.dispose();
    jitsiApi = null;
    jitsiContainer.innerHTML = "";
    leaveBtn.style.display = "none";
    leaveSound.play().catch(() => {});
  }
});
