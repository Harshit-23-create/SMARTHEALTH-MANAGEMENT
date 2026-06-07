const variantStyles = {
  default: "bg-primary/10 text-primary",
  success: "bg-[hsl(145_65%_92%)] text-[hsl(145_65%_30%)]",
  warning: "bg-[hsl(38_92%_92%)] text-[hsl(38_80%_30%)]",
  critical: "bg-[hsl(0_72%_92%)] text-[hsl(0_72%_40%)]",
  info: "bg-accent text-accent-foreground",
};

const StatCard = ({ title, value, icon: Icon, trend, trendUp, variant = "default" }) => {
  return (
    <div className="stat-card animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trendUp ? "text-success" : "text-destructive"}`}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${variantStyles[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
