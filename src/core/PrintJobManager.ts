import { dbPromise } from "./db";
import type {PrintDestination, PrintJob, PrintPriority, PrintStatus} from "./types";

export class PrintJobManager {
  private jobs: PrintJob[] = [];
  private listeners: ((job: PrintJob, error?: string) => void)[] = [];
  private isProcessing = false;

  constructor() {
    this.loadJobs();
  }

  async loadJobs() {
    const db = await dbPromise;
    const jobs = await db.get("printJobs", "all");
    this.jobs = jobs || [];
  }

  async saveJobs() {
    const db = await dbPromise;
    await db.put("printJobs", this.jobs, "all");
  }

  addListener(listener: (job: PrintJob, error?: string) => void) {
    this.listeners.push(listener);
  }

  notify(job: PrintJob, error?: string) {
    this.listeners.forEach(fn => fn(job, error));
  }

  addJob(orderId: string, destination: PrintDestination, priority: PrintPriority, templateType: string) {
    const job: PrintJob = {
      id: Date.now().toString() + Math.random().toString(16).slice(2),
      orderId,
      destination,
      status: "pending",
      priority,
      attempts: 0,
      createdAt: new Date().toISOString(),
      templateType,
    };
    this.jobs.push(job);
    this.saveJobs();
    this.processJobs();
  }

  async processJobs() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    const priorities = { high: 3, normal: 2, low: 1 };
    this.jobs.sort((a, b) => {
      return priorities[b.priority] - priorities[a.priority];
    });
    for (const job of this.jobs.filter(j => j.status === "pending" || j.status === "failed")) {
      await this.printJob(job);
    }
    this.isProcessing = false;
  }

  async printJob(job: PrintJob) {
    job.status = "printing";
    this.saveJobs();
    try {
      const formatted = this.formatReceipt(job.templateType, job.orderId, job.destination);
      await this.simulatePrint(formatted, job.destination);
      job.status = "success";
      job.lastError = undefined;
      this.notify(job);
    } catch (err: any) {
      job.status = "failed";
      job.attempts++;
      job.lastError = err?.message ?? String(err);
      this.notify(job, job.lastError);
      if (job.attempts < 3) {
        setTimeout(() => this.printJob(job), 2000 * job.attempts);
      }
    }
    this.saveJobs();
  }

  formatReceipt(templateType: string, orderId: string, destination: PrintDestination): string {
    switch (templateType) {
      case "kitchen":
        return `--- Kitchen Order ---\nOrder: ${orderId}\nDestination: ${destination}`;
      case "bar":
        return `--- Bar Order ---\nOrder: ${orderId}\nDestination: ${destination}`;
      case "receipt":
        return `--- Receipt ---\nOrder: ${orderId}\nDestination: ${destination}`;
      default:
        return `--- Print Job ---\nOrder: ${orderId}\nDestination: ${destination}`;
    }
  }

  async simulatePrint(content: string, destination: PrintDestination) {
    if (Math.random() < 0.2) throw new Error("Printer not responding");
    await new Promise(res => setTimeout(res, 500));
    alert(`${content} Printed to ${destination}`);
    return true;
  }

  getJobs(): PrintJob[] {
    return this.jobs;
  }

  getJobsByStatus(status: PrintStatus): PrintJob[] {
    return this.jobs.filter(j => j.status === status);
  }

  clearJobs() {
    this.jobs = [];
    this.saveJobs();
  }
}
