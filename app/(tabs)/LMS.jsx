
import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Quiz questions provided
const QUESTIONS = [
    {
        question: "What is the first step in greeting a customer?",
        options: ["Ignore customer", "Smile and greet", "Walk away", "Check phone"],
        answer: 1,
    },
    {
        question: "What improves customer satisfaction?",
        options: ["Rude behavior", "Quick assistance", "Ignoring complaints", "Late response"],
        answer: 1,
    },
    {
        question: "Why is product knowledge important?",
        options: ["To waste time", "To answer customer queries", "To avoid customers", "None"],
        answer: 1,
    },
    {
        question: "What is important for store safety?",
        options: ["Blocked exits", "Clean aisles", "Loose wires", "Wet floor"],
        answer: 1,
    },
    {
        question: "How should staff handle complaints?",
        options: ["Argue", "Ignore", "Listen and help", "Walk away"],
        answer: 2,
    },
];

export default function LMS() {
    // Navigation & Quiz States
    const [quizActive, setQuizActive] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    // Handle option selection
    const handleOptionSelect = (index) => {
        if (selectedOption !== null) return; // Prevent changing answer after selection
        setSelectedOption(index);

        if (index === QUESTIONS[currentQuestionIndex].answer) {
            setScore((prev) => prev + 1);
        }
    };

    // Move to next question or complete quiz
    const handleNext = () => {
        if (currentQuestionIndex < QUESTIONS.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption(null);
        } else {
            setQuizCompleted(true);
        }
    };

    // Reset quiz state to go back or retry
    const resetQuiz = () => {
        setQuizActive(false);
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setQuizCompleted(false);
    };

    // --- QUIZ VIEW RENDER ---
    if (quizActive) {
        const currentQuestion = QUESTIONS[currentQuestionIndex];

        return (
            <SafeAreaView style={styles.quizContainer}>
                {/* Quiz Header */}
                <View style={styles.quizHeader}>
                    <TouchableOpacity onPress={resetQuiz} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#0B2D4A" />
                    </TouchableOpacity>
                    <Text style={styles.quizHeaderTitle}>Practice Quiz</Text>
                    <Text style={styles.quizProgress}>
                        {quizCompleted ? QUESTIONS.length : currentQuestionIndex + 1}/{QUESTIONS.length}
                    </Text>
                </View>

                {!quizCompleted ? (
                    <View style={styles.quizContent}>
                        {/* Question */}
                        <Text style={styles.questionText}>{currentQuestion.question}</Text>

                        {/* Options */}
                        <View style={styles.optionsContainer}>
                            {currentQuestion.options.map((option, index) => {
                                let optionStyle = styles.optionButton;
                                let optionTextStyle = styles.optionText;

                                // Highlight answers if selected
                                if (selectedOption !== null) {
                                    if (index === currentQuestion.answer) {
                                        optionStyle = [styles.optionButton, styles.correctOption];
                                        optionTextStyle = [styles.optionText, styles.correctOptionText];
                                    } else if (index === selectedOption) {
                                        optionStyle = [styles.optionButton, styles.wrongOption];
                                        optionTextStyle = [styles.optionText, styles.wrongOptionText];
                                    }
                                }

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={optionStyle}
                                        onPress={() => handleOptionSelect(index)}
                                        disabled={selectedOption !== null}
                                    >
                                        <Text style={optionTextStyle}>{option}</Text>
                                        {selectedOption !== null && index === currentQuestion.answer && (
                                            <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
                                        )}
                                        {selectedOption !== null && index === selectedOption && index !== currentQuestion.answer && (
                                            <Ionicons name="close-circle" size={20} color="#C62828" />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Next Button */}
                        {selectedOption !== null && (
                            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                                <Text style={styles.nextButtonText}>
                                    {currentQuestionIndex === QUESTIONS.length - 1 ? "Finish Quiz" : "Next Question"}
                                </Text>
                                <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 5 }} />
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    /* Quiz Results Screen */
                    <View style={styles.resultContainer}>
                        <Ionicons name="trophy-outline" size={80} color="#ff7b00" />
                        <Text style={styles.resultTitle}>Quiz Completed!</Text>
                        <Text style={styles.resultScore}>
                            You scored <Text style={{ color: "#ff7b00" }}>{score}</Text> out of {QUESTIONS.length}
                        </Text>
                        <Text style={styles.resultFeedback}>
                            {score === QUESTIONS.length ? "Perfect Score! Excellent Work!" : "Keep learning and practice again!"}
                        </Text>

                        <TouchableOpacity style={styles.primaryButton} onPress={resetQuiz}>
                            <Text style={styles.primaryButtonText}>Back to Dashboard</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        );
    }

    // --- MAIN LMS DASHBOARD VIEW ---
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.smallTitle}>LEARNING HUB</Text>
                <Text style={styles.title}>My Learning</Text>
                <Text style={styles.subtitle}>
                    Complete courses and grow your retail skills.
                </Text>
            </View>

            {/* Progress Card */}
            <View style={styles.progressCard}>
                <View>
                    <Text style={styles.progressLabel}>Overall Progress</Text>
                    <Text style={styles.progressValue}>68%</Text>
                </View>

                <View style={styles.circle}>
                    <Ionicons name="school" size={34} color="#fff" />
                </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statText}>Courses</Text>
                </View>

                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>5</Text>
                    <Text style={styles.statText}>Completed</Text>
                </View>

                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>3</Text>
                    <Text style={styles.statText}>Certificates</Text>
                </View>
            </View>

            {/* Continue Learning */}
            <Text style={styles.sectionTitle}>Continue Learning</Text>

            <View style={styles.courseCard}>
                <View style={styles.courseIcon}>
                    <Ionicons name="book-outline" size={28} color="#ff7b00" />
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.courseTitle}>Customer Service Excellence</Text>

                    <Text style={styles.courseSubtitle}>Module 4 of 8 Completed</Text>

                    <View style={styles.progressBar}>
                        <View style={styles.progressFill} />
                    </View>
                </View>

                {/* Triggers Quiz Mode */}
                <TouchableOpacity style={styles.playButton} onPress={() => setQuizActive(true)}>
                    <Ionicons name="play" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Assigned Courses */}
            <Text style={styles.sectionTitle}>Assigned Courses</Text>

            <View style={styles.assignmentCard}>
                <Ionicons name="videocam-outline" size={24} color="#ff7b00" />

                <View style={styles.assignmentContent}>
                    <Text style={styles.assignmentTitle}>Store Operations Training</Text>
                    <Text style={styles.assignmentDate}>Due in 3 days</Text>
                </View>
            </View>

            <View style={styles.assignmentCard}>
                <Ionicons name="clipboard-outline" size={24} color="#ff7b00" />

                <View style={styles.assignmentContent}>
                    <Text style={styles.assignmentTitle}>Safety & Compliance</Text>
                    <Text style={styles.assignmentDate}>Due in 7 days</Text>
                </View>
            </View>

            {/* Certificates */}
            <Text style={styles.sectionTitle}>Certificates</Text>

            <View style={styles.certificateCard}>
                <Ionicons name="ribbon-outline" size={32} color="#ff7b00" />
                <Text style={styles.certificateText}>Retail Excellence Certification</Text>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // Existing Styles
    container: {
        flex: 1,
        backgroundColor: "#F7F8FA",
    },
    header: {
        backgroundColor: "#0B2D4A",
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    smallTitle: {
        color: "#F5A623",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
    },
    title: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 6,
    },
    subtitle: {
        color: "#D8DDE5",
        marginTop: 6,
    },
    progressCard: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginTop: -25,
        borderRadius: 20,
        padding: 18,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 4,
    },
    progressLabel: {
        color: "#777",
    },
    progressValue: {
        fontSize: 34,
        fontWeight: "bold",
        color: "#0B2D4A",
    },
    circle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#ff7b00",
        justifyContent: "center",
        alignItems: "center",
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginTop: 20,
    },
    statBox: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 18,
        marginHorizontal: 4,
        borderRadius: 16,
        alignItems: "center",
    },
    statNumber: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#ff7b00",
    },
    statText: {
        marginTop: 5,
        color: "#666",
    },
    sectionTitle: {
        marginTop: 25,
        marginHorizontal: 20,
        marginBottom: 12,
        fontSize: 18,
        fontWeight: "bold",
        color: "#222",
    },
    courseCard: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 18,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    courseIcon: {
        marginRight: 15,
    },
    courseTitle: {
        fontWeight: "bold",
        fontSize: 16,
    },
    courseSubtitle: {
        color: "#777",
        marginTop: 4,
    },
    progressBar: {
        height: 8,
        backgroundColor: "#E5E5E5",
        borderRadius: 10,
        marginTop: 10,
    },
    progressFill: {
        width: "50%",
        height: "100%",
        backgroundColor: "#ff7b00",
        borderRadius: 10,
    },
    playButton: {
        backgroundColor: "#ff7b00",
        width: 45,
        height: 45,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    assignmentCard: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginBottom: 12,
        borderRadius: 16,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    assignmentContent: {
        marginLeft: 15,
    },
    assignmentTitle: {
        fontWeight: "bold",
        fontSize: 15,
    },
    assignmentDate: {
        color: "#777",
        marginTop: 4,
    },
    certificateCard: {
        backgroundColor: "#fff",
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
    },
    certificateText: {
        marginLeft: 15,
        fontWeight: "600",
        fontSize: 15,
    },

    // New Quiz Specific UI Styles
    quizContainer: {
        flex: 1,
        backgroundColor: "#F7F8FA",
    },
    quizHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
        marginTop: 40,
    },
    backButton: {
        padding: 4,
    },
    quizHeaderTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0B2D4A",
    },
    quizProgress: {
        fontSize: 14,
        fontWeight: "600",
        color: "#ff7b00",
    },
    quizContent: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    questionText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#0B2D4A",
        marginBottom: 30,
        textAlign: "center",
        lineHeight: 28,
    },
    optionsContainer: {
        width: "100%",
        marginBottom: 20,
    },
    optionButton: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E5E5",
        elevation: 1,
    },
    optionText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    correctOption: {
        backgroundColor: "#E8F5E9",
        borderColor: "#2E7D32",
    },
    correctOptionText: {
        color: "#2E7D32",
        fontWeight: "bold",
    },
    wrongOption: {
        backgroundColor: "#FFEBEE",
        borderColor: "#C62828",
    },
    wrongOptionText: {
        color: "#C62828",
        fontWeight: "bold",
    },
    nextButton: {
        backgroundColor: "#0B2D4A",
        padding: 16,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    nextButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    resultContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    resultTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#0B2D4A",
        marginTop: 20,
        marginBottom: 10,
    },
    resultScore: {
        fontSize: 20,
        fontWeight: "600",
        color: "#444",
        marginBottom: 10,
    },
    resultFeedback: {
        fontSize: 15,
        color: "#666",
        textAlign: "center",
        marginBottom: 40,
    },
    primaryButton: {
        backgroundColor: "#ff7b00",
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        elevation: 2,
    },
    primaryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
