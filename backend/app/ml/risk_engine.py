"""
Risk Calculation Engine - Hybrid Transparent Model

This module implements a rule-based risk calculation system that is
designed to be replaced by ML models in future versions while maintaining
the same output format and interface.
"""

from typing import List, Dict, Tuple


class RiskCalculator:
    """
    Transparent hybrid risk engine for calculating student academic risk.
    
    Risk Score Components (Total: 100 points):
    - Attendance Factor (0-25): Lowest attendance impacts risk
    - Performance Factor (0-25): Current academic performance
    - History Factor (0-20): Historical performance comparison
    - Assignment Factor (0-15): Assignment completion rate
    - Trend Factor (0-15): Performance trajectory
    """

    ATTENDANCE_MAX = 25
    PERFORMANCE_MAX = 25
    HISTORY_MAX = 20
    ASSIGNMENT_MAX = 15
    TREND_MAX = 15
    MAX_TOTAL = 100

    # Risk thresholds
    LOW_RISK_THRESHOLD = 40
    MEDIUM_RISK_THRESHOLD = 70

    @staticmethod
    def calculate_attendance_factor(attendance_pct: float) -> Tuple[float, str]:
        """
        Calculate attendance contribution to risk (0-25 points).
        
        Rules:
        - Below 70%: +25 points (high risk)
        - 70-80%: +15 points (medium risk)
        - 80-90%: +5 points (low risk)
        - Above 90%: 0 points (safe)
        """
        if attendance_pct < 70:
            return 25, "Very low attendance (below 70%)"
        elif attendance_pct < 80:
            return 15, "Low attendance (70-80%)"
        elif attendance_pct < 90:
            return 5, "Moderate attendance (80-90%)"
        else:
            return 0, "Good attendance (above 90%)"

    @staticmethod
    def calculate_performance_factor(current_avg: float) -> Tuple[float, str]:
        """
        Calculate current performance contribution (0-25 points).
        
        Rules:
        - Below 40%: +25 points (failing)
        - 40-60%: +15 points (poor)
        - 60-75%: +10 points (fair)
        - Above 75%: 0 points (good)
        """
        if current_avg < 40:
            return 25, "Failing performance (below 40%)"
        elif current_avg < 60:
            return 15, "Poor performance (40-60%)"
        elif current_avg < 75:
            return 10, "Fair performance (60-75%)"
        else:
            return 0, "Good performance (above 75%)"

    @staticmethod
    def calculate_history_factor(prev_avg: float, current_avg: float) -> Tuple[float, str]:
        """
        Calculate historical performance comparison (0-20 points).
        
        Rules:
        - Current significantly lower than previous (>10% drop): +20 points
        - Current lower than previous (5-10% drop): +10 points
        - Stable or better: 0-5 points
        """
        if prev_avg == 0:
            return 0, "No previous performance data"

        diff_pct = ((prev_avg - current_avg) / prev_avg) * 100

        if diff_pct > 10:
            return 20, f"Significant performance drop ({diff_pct:.1f}%)"
        elif diff_pct > 5:
            return 10, f"Moderate performance drop ({diff_pct:.1f}%)"
        elif diff_pct > 0:
            return 5, f"Minor performance decline ({diff_pct:.1f}%)"
        else:
            return 0, "Performance stable or improved"

    @staticmethod
    def calculate_assignment_factor(completion_pct: float) -> Tuple[float, str]:
        """
        Calculate assignment completion contribution (0-15 points).
        
        Rules:
        - Below 50%: +15 points (many overdue)
        - 50-70%: +10 points (several overdue)
        - 70-85%: +5 points (few overdue)
        - Above 85%: 0 points (mostly done)
        """
        if completion_pct < 50:
            return 15, f"Very low assignment completion ({completion_pct:.1f}%)"
        elif completion_pct < 70:
            return 10, f"Low assignment completion ({completion_pct:.1f}%)"
        elif completion_pct < 85:
            return 5, f"Moderate assignment completion ({completion_pct:.1f}%)"
        else:
            return 0, f"Good assignment completion ({completion_pct:.1f}%)"

    @staticmethod
    def calculate_trend_factor(performance_history: List[float]) -> Tuple[float, str]:
        """
        Calculate performance trend contribution (0-15 points).
        
        Rules:
        - Consistently declining: +15 points
        - Mixed/unstable: +10 points
        - Stable: +5 points
        - Improving: 0 points
        """
        if len(performance_history) < 2:
            return 0, "Insufficient history for trend analysis"

        # Calculate trend
        recent = performance_history[-3:] if len(performance_history) >= 3 else performance_history
        
        if len(recent) >= 2:
            differences = [recent[i+1] - recent[i] for i in range(len(recent)-1)]
            
            # All declining
            if all(d < -0.5 for d in differences):
                return 15, f"Continuously declining trend: {' → '.join([f'{x:.1f}' for x in recent])}"
            # All improving
            elif all(d > 0.5 for d in differences):
                return 0, f"Improving trend: {' → '.join([f'{x:.1f}' for x in recent])}"
            # Mixed
            else:
                avg_diff = sum(differences) / len(differences)
                if avg_diff < 0:
                    return 10, f"Unstable/mixed trend: {' → '.join([f'{x:.1f}' for x in recent])}"
                else:
                    return 5, f"Stable trend: {' → '.join([f'{x:.1f}' for x in recent])}"

        return 5, "Stable trend"

    @classmethod
    def calculate_total_risk(
        cls,
        attendance_pct: float,
        current_avg: float,
        prev_avg: float,
        assignment_completion: float,
        performance_history: List[float],
    ) -> Dict:
        """
        Calculate total academic risk score.
        
        Returns:
            Dict with risk_score, risk_level, and individual factor contributions
        """
        # Calculate each factor
        attendance_factor, attendance_explanation = cls.calculate_attendance_factor(attendance_pct)
        performance_factor, performance_explanation = cls.calculate_performance_factor(current_avg)
        history_factor, history_explanation = cls.calculate_history_factor(prev_avg, current_avg)
        assignment_factor, assignment_explanation = cls.calculate_assignment_factor(assignment_completion)
        trend_factor, trend_explanation = cls.calculate_trend_factor(performance_history)

        # Calculate total
        total_score = (
            attendance_factor
            + performance_factor
            + history_factor
            + assignment_factor
            + trend_factor
        )

        # Determine risk level
        if total_score < cls.LOW_RISK_THRESHOLD:
            risk_level = "low"
        elif total_score < cls.MEDIUM_RISK_THRESHOLD:
            risk_level = "medium"
        else:
            risk_level = "high"

        return {
            "overall_score": min(total_score, cls.MAX_TOTAL),
            "risk_level": risk_level,
            "attendance_factor": attendance_factor,
            "performance_factor": performance_factor,
            "history_factor": history_factor,
            "assignment_factor": assignment_factor,
            "trend_factor": trend_factor,
            "factors": [
                {
                    "name": "Attendance",
                    "contribution": attendance_factor,
                    "max_contribution": cls.ATTENDANCE_MAX,
                    "explanation": attendance_explanation,
                },
                {
                    "name": "Current Performance",
                    "contribution": performance_factor,
                    "max_contribution": cls.PERFORMANCE_MAX,
                    "explanation": performance_explanation,
                },
                {
                    "name": "Historical Performance",
                    "contribution": history_factor,
                    "max_contribution": cls.HISTORY_MAX,
                    "explanation": history_explanation,
                },
                {
                    "name": "Assignment Completion",
                    "contribution": assignment_factor,
                    "max_contribution": cls.ASSIGNMENT_MAX,
                    "explanation": assignment_explanation,
                },
                {
                    "name": "Performance Trend",
                    "contribution": trend_factor,
                    "max_contribution": cls.TREND_MAX,
                    "explanation": trend_explanation,
                },
            ],
        }
